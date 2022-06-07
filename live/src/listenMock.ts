export default (cb: (port: number, evt: number[]) => any) => {
  const loop = () => {
    cb(
      ~~(Math.random() * 5),
      Array(3)
        .fill(null)
        .map(() => Math.random())
    );
    setTimeout(loop, 1000);
  };
  loop();
};
