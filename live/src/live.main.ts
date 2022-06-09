import listen from "./listen";
import plot from "./plot";
import bgSrc from "./sounds/amo/composition.mp3";
import humSrc from "./sounds/amo/ii. humility 2.mp3";
import fastSrc from "./sounds/amo/i. fast touch.mp3";
import _ from "lodash";

const ac = new AudioContext();

const createStart = async (src: string, wait: number) => {
  const resp = await fetch(src);
  const arrayBuffer = await resp.arrayBuffer();
  const audioBuffer = await ac.decodeAudioData(arrayBuffer);
  const start = () => {
    console.log("started");
    const source = ac.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ac.destination);
    source.start();
  };
  return _.throttle(start, wait);
};

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
bgGain.gain.value = 1;

const humGain = createGain(humSrc);
humGain.gain.value = 0;

const startFast = await createStart(fastSrc, 1000 / 2);

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

// DEBUG
document.addEventListener("keydown", (evt) => {
  if (evt.key !== " ") return;
  console.log("key down");
  startFast();
});
