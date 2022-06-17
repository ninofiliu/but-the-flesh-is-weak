import React, { useEffect, useState } from "react";

import touchSrc from "./sounds/amo/touch.mp3";
import ac from "./ac";
import Graph from "./Graph";

export default ({
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
