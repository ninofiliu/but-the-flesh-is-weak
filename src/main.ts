import untypedData from "./data.json";

const width = 500;
const height = 500;
const data = untypedData as (number | null)[][][];
let source = 0;
let column = 0;

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.style.border = "1px solid black";
const ctx = canvas.getContext("2d")!;

const isNumberArray = (values: (number | null)[]): values is number[] =>
  !values.some((value) => value === null);

const update = () => {
  const values = data[source].map((row) => row[column]);
  if (!isNumberArray(values)) return console.log("null detected");
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return console.log("all same");
  const points = values.map(
    (v, i) =>
      [
        (width * i) / (values.length - 1),
        (height * (v - min)) / (max - min),
      ] as const
  );
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "black";
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(...p) : ctx.lineTo(...p)));
  ctx.stroke();
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

const columnInput = document.createElement("input");
columnInput.type = "number";
columnInput.min = "0";
columnInput.step = "1";
columnInput.max = `${data[0].length - 1}`;
columnInput.value = `${column}`;
columnInput.addEventListener("input", () => {
  column = +columnInput.value;
  update();
});

const header = document.createElement("div");
header.append(sourceInput, columnInput);
document.body.append(header, canvas);

update();
