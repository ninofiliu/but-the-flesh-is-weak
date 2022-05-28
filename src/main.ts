import untypedData from "./data.json";

const width = 500;
const height = 500;
const savePrefix = "xy";

const data = untypedData as (number | null)[][][];
let source = 0;
let cx = 0;
let cy = 0;

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.style.border = "1px solid black";
const ctx = canvas.getContext("2d")!;

const isNumberArray = (values: (number | null)[]): values is number[] =>
  !values.some((value) => value === null);

const update = () => {
  const m = data[source];
  const xs = m.map((row) => row[cx]);
  if (!isNumberArray(xs)) return console.log("null detected");
  const xmin = Math.min(...xs);
  const xmax = Math.max(...xs);
  if (xmin === xmax) return console.log("all same");

  const ys = m.map((row) => row[cy]);
  if (!isNumberArray(ys)) return console.log("null detected");
  const ymin = Math.min(...ys);
  const ymax = Math.max(...ys);
  if (ymin === ymax) return console.log("all same");

  const ps = Array(m.length)
    .fill(null)
    .map(
      (_, i) =>
        [
          width * ((xs[i] - xmin) / (xmax - xmin)),
          height * ((ys[i] - ymin) / (ymax - ymin)),
        ] as const
    );

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ps.forEach((p, i) => (i === 0 ? ctx.moveTo(...p) : ctx.lineTo(...p)));
  ctx.stroke();

  if (savePrefix) {
    const a = document.createElement("a");
    a.download = `${savePrefix}.${source}-${cx}-${cy}.png`;
    a.href = canvas.toDataURL();
    a.click();
  }
};

const sourceInput = document.createElement("input");
sourceInput.type = "number";
sourceInput.min = "0";
sourceInput.step = "1";
sourceInput.max = `${data.length - 1}`;
sourceInput.value = `${source}`;
sourceInput.addEventListener("input", () => {
  source = +sourceInput.value;
  update();
});

const cxInput = document.createElement("input");
cxInput.type = "number";
cxInput.min = "0";
cxInput.step = "1";
cxInput.max = `${data[0].length - 1}`;
cxInput.value = `${cx}`;
cxInput.addEventListener("input", () => {
  cx = +cxInput.value;
  update();
});

const cyInput = document.createElement("input");
cyInput.type = "number";
cyInput.min = "0";
cyInput.step = "1";
cyInput.max = `${data[0].length - 1}`;
cyInput.value = `${cy}`;
cyInput.addEventListener("input", () => {
  cy = +cyInput.value;
  update();
});

const header = document.createElement("div");
header.append(sourceInput, cxInput, cyInput);
document.body.append(header, canvas);

update();
