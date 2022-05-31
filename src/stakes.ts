import untypedData from "./data.json";
import { randomPick } from "./lib";

type Point = { x: number; y: number };
type Path = { from: Point; to: Point };

const size = 500;
const blur = 4;
const lineWidth = 6;
const sampleSize = 100;
let source: number;
let cx: number;
let cy: number;

const normalize = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((v) => (v - min) / (max - min));
};

const coord = (v: number) => size * (0.1 + 0.8 * v);

const data = untypedData as number[][][];
const canvas = document.createElement("canvas");
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext("2d")!;
ctx.lineCap = "round";
ctx.lineWidth = lineWidth;
ctx.filter = `blur(${blur}px) contrast(2)`;
document.body.style.background = "#eee";
document.body.append(canvas);

const update = () => {
  source = Math.floor(Math.random() * data.length);
  cx = Math.floor(Math.random() * data[source].length);
  cy = Math.floor(Math.random() * data[source].length);

  const { length } = data[source][0];
  const xs = normalize(data[source][cx]);
  const ys = normalize(data[source][cy]);
  const ps = Array(length)
    .fill(null)
    .map((_, i) => ({ x: xs[i], y: ys[i] }));

  const paths = [] as Path[];
  const addPath = (from: Point) => {
    const tos = Array(Math.min(sampleSize, ps.length))
      .fill(null)
      .map(() => randomPick(ps))
      .map((to) => ({ to, d2: (to.x - from.x) ** 2 + (to.y - from.y) ** 2 }))
      .sort((a, b) => a.d2 - b.d2)
      .slice(0, 3)
      .map(({ to }) => to);
    for (const to of tos) paths.push({ from, to });
  };
  for (const p of ps) addPath(p);
  addPath({ x: 0, y: 0 });
  addPath({ x: 0, y: 1 });
  addPath({ x: 1, y: 0 });
  addPath({ x: 1, y: 1 });

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "black";
  for (const { from, to } of paths) {
    ctx.beginPath();
    ctx.moveTo(coord(from.x), coord(from.y));
    ctx.lineTo(coord(to.x), coord(to.y));
    ctx.stroke();
  }

  ctx.fillStyle = "red";
  ctx.fillRect(coord(0) - 1, coord(0) - 1, 5, 5);
  ctx.fillRect(coord(0) - 1, coord(1) - 1, 5, 5);
  ctx.fillRect(coord(1) - 1, coord(0) - 1, 5, 5);
  ctx.fillRect(coord(1) - 1, coord(1) - 1, 5, 5);

  ctx.drawImage(canvas, 0, 0);
};

const save = () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL();
  a.download = `closest.${blur}-${source}-${cx}-${cy}.png`;
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
