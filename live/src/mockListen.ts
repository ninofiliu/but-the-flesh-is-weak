import { Data } from "./types";

const down = {} as Record<string, boolean>;

document.addEventListener("keydown", (evt) => {
  down[evt.key] = true;
});
document.addEventListener("keyup", (evt) => {
  down[evt.key] = false;
});

export default (onData: (data: Data) => any) => {
  let a0 = 0.7;
  let a1 = 1;
  let a2 = 0.5;
  const loop = () => {
    a0 = 0.95 * a0 + 0.05 * (down.a ? 0.3 : 0.7) + Math.random() * 0.01;
    a1 = 0.8 * a1 + 0.2 * (down.z ? 0 : 1);
    a2 = 0.9 * a2 + 0.1 * (down.e ? 0.2 : 0.5);
    onData({ a0, a1, a2 });
    setTimeout(loop, 1000 / 10);
  };
  loop();
};
