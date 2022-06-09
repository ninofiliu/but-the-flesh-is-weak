export default (onData: (nbs: number[]) => any) => {
  let a0 = 0.5;
  let a1 = 0.5;
  const loop = () => {
    a0 = Math.max(0, Math.min(1024, a0 + (-0.5 + Math.random()) * 20));
    a1 = Math.max(0, Math.min(1024, a1 + (-0.5 + Math.random()) * 20));
    onData([a0, a1]);
    requestAnimationFrame(loop);
  };
  loop();
};
