import React from "react";
import Graph from "./Graph";
import RangeInput from "./RangeInput";
import SrcPicker from "./SrcPicker";

import useLoop from "./useLoop";
import useSmoothed from "./useSmoothed";

export default ({ name, raw }: { name: string; raw: number }) => {
  const { audio, gain } = useLoop();
  const { smoothed, smoother, setSmoother } = useSmoothed(raw);

  return (
    <>
      <h2>{name}</h2>
      <SrcPicker
        value={audio?.src ?? ""}
        onChange={(src) => (audio!.src = src)}
      />
      <RangeInput value={smoother} setValue={setSmoother} name="smoother" />
      <Graph
        values={{
          red: raw,
          orange: smoothed,
        }}
      />
    </>
  );
};
