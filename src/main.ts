import untypedData from "./data.json";

const width = 500;
const height = 500;
const blur = 4;
const skinny = 0.1;
let source: number;
let cx: number;
let cy: number;

const data = untypedData as number[][][];

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d")!;
ctx.lineWidth = 2 * blur;
ctx.filter = `blur(${blur}px) brightness(0.6) contrast(5)`;
document.body.style.background = "#eee";
document.body.append(canvas);

const normalize = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((v) => (v - min) / (max - min));
};

const interpolate = (cursor: number, values: number[]) => {
  const t = cursor * values.length - 1;
  const s = t % 1;
  const iFrom = Math.floor(t);
  const iTo = iFrom + 1;
  return (1 - s) * values[iFrom] + s * values[iTo];
};

const update = () => {
  source = Math.floor(Math.random() * data.length);
  cx = Math.floor(Math.random() * data[source].length);
  cy = Math.floor(Math.random() * data[source].length);

  const xs = normalize(data[source][cx]);
  const ys = normalize(data[source][cy]);

  const { length } = data[source][0];
  const ps = Array(length)
    .fill(null)
    .map((_, i) => {
      const cursor = i / length;
      const xMeasured = xs[i];
      const yMeasured = ys[i];
      const xProjMin = interpolate(cursor, [
        0,
        skinny,
        1,
        skinny,
        0,
        skinny,
        1,
      ]);
      const xProjMax = interpolate(cursor, [
        0,
        1 - skinny,
        1,
        1 - skinny,
        0,
        1 - skinny,
        1,
      ]);
      const yProjMin = interpolate(cursor, [
        0,
        skinny,
        0,
        skinny,
        1,
        skinny,
        1,
      ]);
      const yProjMax = interpolate(cursor, [
        0,
        1 - skinny,
        0,
        1 - skinny,
        1,
        1 - skinny,
        1,
      ]);
      const xPoint = xProjMin + (xProjMax - xProjMin) * xMeasured;
      const yPoint = yProjMin + (yProjMax - yProjMin) * yMeasured;
      const xCanvas = 5 * blur + (width - 10 * blur) * xPoint;
      const yCanvas = 5 * blur + (height - 10 * blur) * yPoint;
      return [xCanvas, yCanvas] as const;
    });

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ps.forEach((p, i) => (i === 0 ? ctx.moveTo(...p) : ctx.lineTo(...p)));
  ctx.stroke();

  ctx.drawImage(canvas, 0, 0);
};

const save = () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL();
  a.download = `blur.${blur}-${source}-${cx}-${cy}.png`;
  a.click();
};

document.addEventListener("keypress", (evt) => {
  switch (evt.key) {
    case "f":
      update();
      break;
    case "s":
      save();
      break;
  }
});
update();
