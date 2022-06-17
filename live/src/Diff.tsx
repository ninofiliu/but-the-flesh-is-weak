import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import RangeInput from "./RangeInput";
import SrcPicker from "./SrcPicker";

import useLoop from "./useLoop";
import useSmoothed from "./useSmoothed";

const mul = 100;

const clamp = (x: number) => Math.max(0, Math.min(1, x));

export default ({ name, raw }: { name: string; raw: number }) => {
  const { gain, src, setSrc } = useLoop();
  const [last, setLast] = useState(raw);
  useEffect(() => {
    setLast(raw);
  }, [raw]);
  const diff = Math.abs(last - raw);
  const { smoothed: smoothedDiff, smoother, setSmoother } = useSmoothed(diff);
  const [threshold, setThreshold] = useState(0.2);

  if (gain) {
    gain.gain.value = clamp((smoothedDiff * mul - threshold) / (1 - threshold));
  }

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
          red: smoothedDiff * mul,
          brown: threshold,
        }}
      />
    </>
  );
};
