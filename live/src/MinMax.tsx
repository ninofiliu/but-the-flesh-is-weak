import { useEffect, useState } from "react";
import SrcPicker from "./SrcPicker";
import RangeInput from "./RangeInput";
import React from "react";
import Graph from "./Graph";
import useLoop from "./useLoop";

export default ({ raw, name }: { raw: number; name: string }) => {
  const [smoother, setSmoother] = useState(0.5);
  const [smooth, setVMooth] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const norm = (smooth - min) / (max - min);
  const { audio, gain } = useLoop();

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

  return (
    <>
      <h2>{name}</h2>
      <SrcPicker
        value={audio?.src ?? ""}
        onChange={(src) => (audio!.src = src)}
      />
      <RangeInput value={smoother} setValue={setSmoother} name="smoother" />
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
