import React, { useEffect, useState } from "react";
import Status from "./Status";
import Graph from "./Graph";
import touchSrc from "./sounds/amo/touch.mp3";
import ac from "./ac";
import useListen from "./useListen";
import MinMax from "./MinMax";

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
