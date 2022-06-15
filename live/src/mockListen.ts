export default (onData: (nbs: number[]) => any) => {
  let a0 = 0.5;
  let a1 = 0.5;
  const loop = () => {
    a0 = Math.max(420, Math.min(480, a0 + (-0.5 + Math.random()) * 2));
    a1 = Math.max(0, Math.min(1024, a1 + (-0.5 + Math.random()) * 100));
    onData([a0, a1]);
    setTimeout(loop, 1000 / 10);
  };
  loop();
};
