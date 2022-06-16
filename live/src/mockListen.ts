const down = {} as Record<string, boolean>;

document.addEventListener("keydown", (evt) => {
  down[evt.key] = true;
});
document.addEventListener("keyup", (evt) => {
  down[evt.key] = false;
});

export default (onData: ({ a0, a1 }: { a0: number; a1: number }) => any) => {
  let a0 = 0.5;
  let a1 = 1;
  const loop = () => {
    a0 = 0.95 * a0 + 0.05 * (down.a ? 0.4 : 0.5) + Math.random() * 0.01;
    a1 = 0.8 * a1 + 0.2 * (down.z ? 0 : 1);
    onData({ a0, a1 });
    setTimeout(loop, 1000 / 10);
  };
  loop();
};
