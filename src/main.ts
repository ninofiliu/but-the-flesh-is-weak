import untypedData from "./data.json";

const width = 500;
const height = 500;
const savePrefix = false;

const data = untypedData as (number | null)[][][];

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.style.border = "1px solid black";
const ctx = canvas.getContext("2d")!;
document.body.append(canvas);

const isNumberArray = (values: (number | null)[]): values is number[] =>
  !values.some((value) => value === null);

const getNormalizedValues = (source: number, col: number) => {
  const rawValues = data[source].map((row) => row[col]);
  if (!isNumberArray(rawValues)) throw new Error("nulls");
  const min = Math.min(...rawValues);
  const max = Math.max(...rawValues);
  if (min === max) throw new Error("same");
  return rawValues.map((v) => (v - min) / (max - min));
};

const update = (source: number, cx: number, cy: number) => {
  const m = data[source];
  const xs = getNormalizedValues(source, cx);
  const ys = getNormalizedValues(source, cy);

  const ps = Array(m.length)
    .fill(null)
    .map((_, i) => [width * xs[i], height * ys[i]] as const);

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

const find = () => {
  const source = Math.floor(Math.random() * data.length);
  const cx = Math.floor(Math.random() * data.length);
  const cy = Math.floor(Math.random() * data.length);
  try {
    update(source, cx, cy);
  } catch (e) {
    requestAnimationFrame(find);
  }
};

document.addEventListener("keypress", (e) => {
  if (e.key !== "f") return;
  find();
});
