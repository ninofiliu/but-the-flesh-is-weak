export default () => {
  const canvas = document.createElement("canvas");
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  canvas.style.imageRendering = "crisp-edges";
  document.body.style.overflow = "hidden";
  document.body.style.margin = "0";
  document.body.style.imageRendering = "crisp-edges";
  document.body.append(canvas);
  const ctx = canvas.getContext("2d")!;

  const plotter = {
    data: [] as number[],
  };

  let x = 0;
  const loop = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(x, 0, 1, height);
    plotter.data.forEach((d, i, { length }) => {
      ctx.fillStyle = `hsl(${+i / length}turn, 100%, 50%)`;
      ctx.fillRect(x, height * (1 - d), 1, 1);
    });
    x = (x + 1) % width;
    requestAnimationFrame(loop);
  };
  loop();

  return plotter;
};
