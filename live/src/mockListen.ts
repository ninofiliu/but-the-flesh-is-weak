const down = {} as Record<string, boolean>;

document.addEventListener("keydown", (evt) => {
  down[evt.key] = true;
});
document.addEventListener("keyup", (evt) => {
  down[evt.key] = false;
});

export default (onData: (nbs: number[]) => any) => {
  let a0 = 1023;
  let a1 = 1023;
  const loop = () => {
    a0 = 0.9 * a0 + 0.1 * (down.a ? 0 : 1023);
    a1 = 0.8 * a1 + 0.2 * (down.z ? 0 : 1023);
    onData([a0, a1]);
    setTimeout(loop, 1000 / 10);
  };
  loop();
};
