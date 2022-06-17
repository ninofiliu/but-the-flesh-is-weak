import React, { useRef, useState } from "react";
import Graph from "./Graph";
import RangeInput from "./RangeInput";
import SrcPicker from "./SrcPicker";

import useLoop from "./useLoop";
import useSmoothed from "./useSmoothed";

const mul = 100;

const clamp = (x: number) => Math.max(0, Math.min(1, x));

export default ({ name, raw }: { name: string; raw: number }) => {
  const { gain, src, setSrc } = useLoop();
  const last = useRef(0);
  const diff = Math.abs(last.current - raw);
  const { smoothed, smoother, setSmoother } = useSmoothed(diff);
  const [threshold, setThreshold] = useState(0.2);

  if (gain) {
    gain.gain.value = clamp(
      (smoothed.current * mul - threshold) / (1 - threshold)
    );
  }

  last.current = raw;

  return (
    <>
      <h2>{name}</h2>
      <SrcPicker value={src} onChange={setSrc} />
      <RangeInput value={smoother} setValue={setSmoother} name="smoother" />
      <RangeInput value={threshold} setValue={setThreshold} name="threshold" />
      <Graph
        values={{
          blue: raw,
          steelblue: diff * mul,
          red: smoothed.current * mul,
          brown: threshold,
        }}
      />
    </>
  );
};
