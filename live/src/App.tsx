import React, { useEffect, useState } from "react";
import Status from "./Status";
import Graph from "./Graph";
import listen from "./listen";
import mockListen from "./mockListen";
import touchSrc from "./sounds/amo/touch.mp3";

const ac = new AudioContext();

// const createAudioGain = (src: string) => {
//   const audio = document.createElement("audio");
//   audio.src = src;
//   audio.autoplay = true;
//   audio.loop = true;
//   const source = ac.createMediaElementSource(audio);
//   const gain = ac.createGain();
//   source.connect(gain);
//   gain.connect(ac.destination);
//   return gain;
// };

const useListen = (maybePort: SerialPort | null) => {
  const [a0, setA0] = useState(0);
  const [a1, setA1] = useState(0);
  const onData = ({ a0, a1 }: { a0: number; a1: number }) => {
    setA0(a0);
    setA1(a1);
  };
  useEffect(() => {
    (async () => {
      if (maybePort) {
        listen(maybePort, onData);
      } else {
        mockListen(onData);
      }
    })();
  }, []);

  return { a0, a1 };
};

const Water = ({ w }: { w: number }) => {
  const smooth = 0.5;
  const [wSmooth, setWSmooth] = useState(0);
  const [wMin, setWMin] = useState(0);
  const [wMax, setWMax] = useState(1);

  const setWMinSafe = (newWMin: number) => {
    if (newWMin >= wMax) return;
    setWMin(newWMin);
  };
  const setWMaxSafe = (newWMax: number) => {
    if (newWMax <= wMin) return;
    setWMax(newWMax);
  };

  useEffect(() => {
    setWSmooth(smooth * wSmooth + (1 - smooth) * w);
  }, [w]);

  return (
    <>
      <h2>Water</h2>
      <div className="control-row">
        <input
          type="range"
          value={wMin}
          min={0}
          max={1}
          step={0.01}
          onChange={(evt) => setWMinSafe(+evt.target.value)}
        />
        <input
          type="number"
          value={wMin}
          min={0}
          max={1}
          step={0.01}
          onChange={(evt) => setWMinSafe(+evt.target.value)}
        />
        water min
      </div>
      <div className="control-row">
        <input
          type="range"
          value={wMax}
          min={0}
          max={1}
          step={0.01}
          onChange={(evt) => setWMaxSafe(+evt.target.value)}
        />
        <input
          type="number"
          value={wMax}
          min={0}
          max={1}
          step={0.01}
          onChange={(evt) => setWMaxSafe(+evt.target.value)}
        />
        water max
      </div>
      <Graph
        values={{
          "#88f": wMin,
          "#88e": wMax,
          "#88d": wSmooth,
        }}
      />
    </>
  );
};

const Touch = ({ t }: { t: number }) => {
  const threshold = 0.75;
  const [lastT, setLastT] = useState(threshold + 1);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    (async () => {
      const resp = await fetch(touchSrc);
      const arrayBuffer = await resp.arrayBuffer();
      const audioBuffer = await ac.decodeAudioData(arrayBuffer);
      setAudioBuffer(audioBuffer);
    })();
  }, []);

  useEffect(() => {
    setLastT(t);
    if (audioBuffer && lastT > threshold && t < threshold) {
      const source = ac.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ac.destination);
      source.start();
      console.log("start");
    }
  }, [t]);
  return (
    <>
      <h2>Touch</h2>
      <Graph
        values={{
          "#f00": t,
          "#800": threshold,
        }}
      />
    </>
  );
};

const Machine = ({
  maybePort,
  portIndex,
}: {
  maybePort: SerialPort | null;
  portIndex: number;
}) => {
  const { a0, a1 } = useListen(maybePort);

  return (
    <>
      <h1>Machine {portIndex}</h1>
      <Graph
        values={{
          "#00f": a0,
          "#f00": a1,
        }}
      />
      <Water w={a0} />
      <Touch t={a1} />
    </>
  );
};

export default () => {
  const supported = "serial" in navigator;
  const [maybePorts, setMaybePorts] = useState<SerialPort[] | null[]>([]);

  useEffect(() => {
    (async () => {
      if (supported) {
        setMaybePorts(await navigator.serial.getPorts());
      } else {
        setMaybePorts([null]);
      }
    })();
  }, []);

  return (
    <>
      <Status supported={supported} />
      {maybePorts.map((maybePorts, portIndex) => (
        <Machine key={portIndex} portIndex={portIndex} maybePort={maybePorts} />
      ))}
    </>
  );
};
