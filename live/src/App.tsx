import React, { useEffect, useState } from "react";
import Status from "./Status";
import Graph from "./Graph";
import listen from "./listen";
import mockListen from "./mockListen";
import touchSrc from "./sounds/amo/touch.mp3";
import waterSrc from "./sounds/amo/liquid2.mp3";
import { Data } from "./types";
import ac from "./ac";
import RangeInput from "./RangeInput";

const createAudioGain = (src: string) => {
  const audio = document.createElement("audio");
  audio.src = src;
  audio.autoplay = true;
  audio.loop = true;
  const source = ac.createMediaElementSource(audio);
  const gain = ac.createGain();
  source.connect(gain);
  gain.connect(ac.destination);
  return gain;
};

const useListen = (maybePort: SerialPort | null) => {
  const [data, setData] = useState<Data>({
    a0: 0,
    a1: 0,
    a2: 0,
  });

  useEffect(() => {
    (async () => {
      if (maybePort) {
        listen(maybePort, setData);
      } else {
        mockListen(setData);
      }
    })();
  }, []);

  return data;
};

const MinMax = ({ raw, name }: { raw: number; name: string }) => {
  const smoother = 0.5;
  const [smooth, setVMooth] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const norm = (smooth - min) / (max - min);
  const [gain, setGain] = useState<GainNode | null>(null);

  const setMinSafe = (newMin: number) => {
    if (newMin >= max) return;
    setMin(newMin);
  };
  const setMaxSafe = (newMax: number) => {
    if (newMax <= min) return;
    setMax(newMax);
  };

  useEffect(() => {
    setVMooth(smoother * smooth + (1 - smoother) * raw);
    if (gain) {
      gain.gain.value = Math.max(0, Math.min(1, norm));
    }
  }, [raw]);

  useEffect(() => {
    setGain(createAudioGain(waterSrc));
  }, []);

  return (
    <>
      <h2>{name}</h2>
      <RangeInput value={min} setValue={setMinSafe} name="min" />
      <RangeInput value={max} setValue={setMaxSafe} name="max" />
      <Graph
        values={{
          "#00f": raw,
          "#88f": smooth,
          "#000": min,
          "#001": max,
        }}
      />
      <Graph
        values={{
          "#44f": norm,
        }}
      />
    </>
  );
};

const Threshold = ({
  raw,
  name,
  threshold,
}: {
  raw: number;
  name: string;
  threshold: number;
}) => {
  const [lastValue, setLastValue] = useState(threshold + 1);
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
    setLastValue(raw);
    if (audioBuffer && lastValue > threshold && raw < threshold) {
      const source = ac.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ac.destination);
      source.start();
      console.log("start");
    }
  }, [raw]);

  return (
    <>
      <h2>{name}</h2>
      <Graph
        values={{
          "#f00": raw,
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
      <MinMax name="water" raw={a0} />
      <Threshold name="touch" raw={a1} threshold={0.75} />
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
