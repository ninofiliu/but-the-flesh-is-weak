export default async (
  port: SerialPort,
  onData: ({ a0, a1 }: { a0: number; a1: number }) => any
) => {
  await port.open({ baudRate: 9600 });
  if (!port.readable) throw new Error("can not read");

  const decoder = new TextDecoder();
  const reader = port.readable.getReader();

  let nStr = "";
  let nbs = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      history.go(0);
    }
    for (const char of decoder.decode(value)) {
      if (char === "," || char === "\n") {
        nbs.push(+nStr);
        nStr = "";
        if (char === "\n") {
          if (nbs.length === 2 && nbs.every((n) => !Number.isNaN(n))) {
            onData({
              a0: nbs[0],
              a1: nbs[1],
            });
          } else {
            console.log("garbage data:", nbs);
          }
          nbs = [];
        }
      } else {
        nStr += char;
      }
    }
  }
};
