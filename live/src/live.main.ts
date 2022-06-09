import listen from "./listen";
import plot from "./plot";
import bgSrc from "./sounds/amo/composition.mp3";
import humSrc from "./sounds/amo/ii. humility 2.mp3";

const ac = new AudioContext();

const createGain = (src: string) => {
  const elt = document.createElement("audio");
  elt.src = src;
  elt.autoplay = true;
  elt.loop = true;
  const source = ac.createMediaElementSource(elt);
  const gain = ac.createGain();
  source.connect(gain);
  gain.connect(ac.destination);
  return gain;
};

const bgGain = createGain(bgSrc);
const humGain = createGain(humSrc);

bgGain.gain.value = 1;
humGain.gain.value = 0;

let hum = 0;
const humSmooth = 0.95;
const humBase = 1024;
const humTop = 980;

listen((ns: number[]) => {
  console.log(...ns);
  hum =
    humSmooth * hum +
    ((1 - humSmooth) * (ns[0] - humBase)) / (humTop - humBase);
  plot({
    blue: hum,
    steelblue: 0.2,
    red: ns[1] / 1024,
  });
  humGain.gain.value = Math.max(0, (hum - 0.2) / 0.8);
});
