import untypedData from "./data.json";

const width = 500;
const height = 500;
const blur = 3;
let source: number;
let cx: number;
let cy: number;

const data = untypedData as number[][][];

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d")!;
ctx.lineWidth = 2 * blur;
ctx.filter = `blur(${blur}px) contrast(5)`;
document.body.append(canvas);

const normalize = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((v) => (v - min) / (max - min));
};

const update = () => {
  source = Math.floor(Math.random() * data.length);
  cx = Math.floor(Math.random() * data[source].length);
  cy = Math.floor(Math.random() * data[source].length);

  const xs = normalize(data[source][cx]);
  const ys = normalize(data[source][cy]);

  const ps = Array(data[source][0].length)
    .fill(null)
    .map(
      (_, i) =>
        [
          5 * blur + (width - 10 * blur) * xs[i],
          5 * blur + (height - 10 * blur) * ys[i],
        ] as const
    );

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
