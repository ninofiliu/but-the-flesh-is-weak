import listen from "./listen";
import plot from "./plot";

let hum = 0;
const humSmooth = 0.95;
const humMin = 980;
const humMax = 1024;

listen((ns: number[]) => {
  console.log(...ns);
  hum =
    humSmooth * hum + ((1 - humSmooth) * (ns[0] - humMin)) / (humMax - humMin);
  plot({
    blue: hum,
    red: ns[1] / 1024,
  });
});
