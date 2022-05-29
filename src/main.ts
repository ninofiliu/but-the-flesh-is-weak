import untypedData from "./data.json";

const width = 500;
const height = 500;

const data = untypedData as number[][][];

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.style.border = "1px solid black";
const ctx = canvas.getContext("2d")!;
document.body.append(canvas);

const getNormalizedValues = (source: number, col: number) => {
  const rawValues = data[source][col];
  const min = Math.min(...rawValues);
  const max = Math.max(...rawValues);
  return rawValues.map((v) => (v - min) / (max - min));
};

const update = () => {
  const source = Math.floor(Math.random() * data.length);
  const cx = Math.floor(Math.random() * data[source].length);
  const cy = Math.floor(Math.random() * data[source].length);

  const xs = getNormalizedValues(source, cx);
  const ys = getNormalizedValues(source, cy);

  const ps = Array(data[source][0].length)
    .fill(null)
    .map((_, i) => [width * xs[i], height * ys[i]] as const);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ps.forEach((p, i) => (i === 0 ? ctx.moveTo(...p) : ctx.lineTo(...p)));
  ctx.stroke();
};

document.addEventListener("keypress", (e) => {
  if (e.key !== "f") return;
  update();
});
update();
