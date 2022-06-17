import { useEffect, useState } from "react";
import SrcPicker from "./SrcPicker";
import RangeInput from "./RangeInput";
import React from "react";
import Graph from "./Graph";
import useLoop from "./useLoop";
import useSmoothed from "./useSmoothed";

export default ({ raw, name }: { raw: number; name: string }) => {
  const { smoothed, smoother, setSmoother } = useSmoothed(raw);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const norm = (smoothed - min) / (max - min);
  const { gain, src, setSrc } = useLoop();

  const setMinSafe = (newMin: number) => {
    if (newMin >= max) return;
    setMin(newMin);
  };
  const setMaxSafe = (newMax: number) => {
    if (newMax <= min) return;
    setMax(newMax);
  };

  useEffect(() => {
    if (gain) {
      gain.gain.value = Math.max(0, Math.min(1, norm));
    }
  }, [raw]);

  return (
    <>
      <h2>{name}</h2>
      <SrcPicker value={src} onChange={setSrc} />
      <RangeInput value={smoother} setValue={setSmoother} name="smoother" />
      <RangeInput value={min} setValue={setMinSafe} name="min" />
      <RangeInput value={max} setValue={setMaxSafe} name="max" />
      <Graph
        values={{
          "#00f": raw,
          "#88f": smoothed,
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
