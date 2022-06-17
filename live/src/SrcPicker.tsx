import composition from "./sounds/amo/composition.mp3";
import hold from "./sounds/amo/hold.mp3";
import liquid1 from "./sounds/amo/liquid1.mp3";
import liquid2 from "./sounds/amo/liquid2.mp3";
import liquid3 from "./sounds/amo/liquid3.mp3";
import touch from "./sounds/amo/touch.mp3";
import React from "react";

const srcs = {
  composition,
  hold,
  liquid1,
  liquid2,
  liquid3,
  touch,
};

export default ({
  value,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => any;
}) => (
  <select value={value} onChange={(evt) => onChange(evt.target.value)}>
    <option value="">none</option>
    {Object.entries(srcs).map(([key, value]) => (
      <option value={value} key={key}>
        {key}
      </option>
    ))}
  </select>
);
