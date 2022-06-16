import React, { useEffect, useState } from "react";
import Status from "./Status";
import Graph from "./Graph";
import listen from "./listen";
import mockListen from "./mockListen";
import touch from "./sounds/amo/touch.mp3";

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

const TouchController = ({ raw }: { raw: number }) => {
  const threshold = 768;
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    (async () => {
      const resp = await fetch(touch);
      const arrayBuffer = await resp.arrayBuffer();
      const audioBuffer = await ac.decodeAudioData(arrayBuffer);
      setAudioBuffer(audioBuffer);
    })();
  }, []);

  useEffect(() => {
    if (audioBuffer && !isPlaying && raw < threshold) {
      const source = ac.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ac.destination);
      source.start();
      setIsPlaying(true);
      source.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }
  }, [raw]);

  useEffect(() => {
    console.log({ isPlaying });
  }, [isPlaying]);

  return (
    <>
      <Graph
        title="Touch"
        values={{ red: raw, brown: threshold }}
        min={0}
        max={1024}
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
  const [touchRaw, setTouchRaw] = useState(NaN);

  const onData = (ns: number[]) => {
    setTouchRaw(ns[1]);
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

  return (
    <>
      <h1>Machine {portIndex}</h1>
      <Graph title="Raw data" values={{ red: touchRaw }} min={0} max={1024} />
      {!isNaN(touchRaw) && <TouchController raw={touchRaw} />}
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
