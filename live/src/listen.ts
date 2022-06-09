export default async (port: SerialPort, onData: (nbs: number[]) => any) => {
  await port.open({ baudRate: 9600 });
  if (!port.readable) throw new Error("can not read");

  const decoder = new TextDecoder();
  const reader = port.readable.getReader();

  let willStop = false;
  const stopButton = document.createElement("button");
  stopButton.textContent = "stop";
  document.body.append(stopButton);
  stopButton.addEventListener("click", () => {
    willStop = true;
  });

  let nStr = "";
  let nbs = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done || willStop) {
      reader.releaseLock();
      history.go(0);
    }
    for (const char of decoder.decode(value)) {
      if (char === "," || char === "\n") {
        nbs.push(+nStr);
        nStr = "";
        if (char === "\n") {
          if (nbs.length === 2 && nbs.every((n) => !Number.isNaN(n))) {
            onData(nbs);
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