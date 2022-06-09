import listen from "./listen";
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

const ports = await navigator.serial.getPorts();
ports.forEach(async (port, portIndex) => {
  let hum = 0;

  const params = {
    humSmooth: 0.95,
    humBase: 1024,
    humTop: 980,
    humThreshold: 0.2,
  } as Record<string, number>;

  for (const key in params) {
    const line = document.createElement("div");
    const desc = document.createElement("span");
    desc.innerHTML = key;
    const input = document.createElement("input");
    input.type = "number";
    input.value = `${params[key]}`;
    input.addEventListener("input", () => {
      params[key] = +input.value;
      console.log(params);
    });
    line.append(desc, input);
    document.body.append(line);
  }

  const canvas = document.createElement("canvas");
  canvas.style.border = "1px solid black";
  canvas.style.display = "block";
  document.body.append(canvas);
  const ctx = canvas.getContext("2d")!;

  let x = 0;

  const plot = (values: { [color: string]: number }) => {
    ctx.fillStyle = "white";
    ctx.fillRect(x, 0, 1, canvas.height);
    for (const color in values) {
      ctx.fillStyle = color;
      ctx.fillRect(x, canvas.height * (1 - values[color]), 1, 1);
    }
    x = (x + 1) % canvas.width;
  };

  listen(port, (ns) => {
    console.log(portIndex, ...ns);
    const humNorm = (ns[0] - params.humBase) / (params.humTop - params.humBase);
    hum = params.humSmooth * hum + (1 - params.humSmooth) * humNorm;
    humGain.gain.value = Math.max(
      0,
      (hum - params.humThreshold) / (1 - params.humThreshold)
    );
    plot({
      blue: hum,
      steelblue: params.humThreshold,
      red: ns[1] / 1024,
    });
  });
});

// DEBUG
document.addEventListener("keydown", (evt) => {
  if (evt.key !== " ") return;
  startFast();
});
