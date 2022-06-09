export default (onData: (nbs: number[]) => any) => {
  const startButton = document.createElement("button");
  startButton.textContent = "start";
  document.body.append(startButton);
  startButton.addEventListener("click", async () => {
    const decoder = new TextDecoder();
    const [port] = await navigator.serial.getPorts();
    // const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    if (!port.readable) throw new Error("can not read");

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
            if (nbs.length === 2) {
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
  });
};
