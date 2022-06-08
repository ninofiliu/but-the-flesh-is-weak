export {};

const canvas = document.createElement("canvas");
canvas.style.border = "1px solid black";
canvas.style.display = "block";
document.body.append(canvas);
const ctx = canvas.getContext("2d")!;
let x = 0;
const plot = (values: { [color: string]: number }) => {
  ctx.fillStyle = "white";
  ctx.fillRect(x, 0, 1, canvas.height);
  for (const color in values) {
    ctx.fillStyle = color;
    ctx.fillRect(x, canvas.height * (1 - values[color]), 1, 1);
  }
  x = (x + 1) % canvas.width;
};

let hum = 0;
const humSmooth = 0.95;
const humMin = 980;
const humMax = 1024;

const onData = (ns: number[]) => {
  console.log(...ns);
  hum =
    humSmooth * hum + ((1 - humSmooth) * (ns[0] - humMin)) / (humMax - humMin);
  plot({
    blue: hum,
    red: ns[1] / 1024,
  });
};

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
  let dataLine = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done || willStop) {
      reader.releaseLock();
      history.go(0);
    }
    for (const char of decoder.decode(value)) {
      if (char === "," || char === "\n") {
        dataLine.push(+nStr);
        nStr = "";
        if (char === "\n") {
          if (dataLine.length === 2) {
            onData(dataLine);
          } else {
            console.log("garbage data:", dataLine);
          }
          dataLine = [];
        }
      } else {
        nStr += char;
      }
    }
  }
});
