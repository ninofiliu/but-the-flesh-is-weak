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

const useTouch = (a1: number) => {
  const threshold = 768;
  const [lastA1, setLastA1] = useState(threshold + 1);
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
    setLastA1(a1);
    if (audioBuffer && lastA1 > threshold && a1 < threshold) {
      const source = ac.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ac.destination);
      source.start();
      console.log("start");
    }
  }, [a1]);

  return { threshold };
};

const Machine = ({
  maybePort,
  portIndex,
}: {
  maybePort: SerialPort | null;
  portIndex: number;
}) => {
  const { a0, a1 } = useListen(maybePort);
  const { threshold } = useTouch(a1);

  return (
    <>
      <h1>Machine {portIndex}</h1>
      <Graph
        title="Raw data"
        values={{
          "#00f": a0 / 1024,
          "#f00": a1 / 1024,
          "#800": threshold / 1024,
        }}
      />
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
