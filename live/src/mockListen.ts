const down = {} as Record<string, boolean>;

document.addEventListener("keydown", (evt) => {
  down[evt.key] = true;
});
document.addEventListener("keyup", (evt) => {
  down[evt.key] = false;
});

export default (onData: ({ a0, a1 }: { a0: number; a1: number }) => any) => {
  let a0 = 450;
  let a1 = 1023;
  const loop = () => {
    a0 = 0.95 * a0 + 0.05 * (down.a ? 400 : 450);
    a1 = 0.8 * a1 + 0.2 * (down.z ? 0 : 1023);
    onData({ a0, a1 });
    setTimeout(loop, 1000 / 10);
  };
  loop();
};
