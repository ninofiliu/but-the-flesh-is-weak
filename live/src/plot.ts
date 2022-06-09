const canvas = document.createElement("canvas");
canvas.style.border = "1px solid black";
canvas.style.display = "block";
document.body.append(canvas);
const ctx = canvas.getContext("2d")!;
let x = 0;

export default (values: { [color: string]: number }) => {
  ctx.fillStyle = "white";
  ctx.fillRect(x, 0, 1, canvas.height);
  for (const color in values) {
    ctx.fillStyle = color;
    ctx.fillRect(x, canvas.height * (1 - values[color]), 1, 1);
  }
  x = (x + 1) % canvas.width;
};
