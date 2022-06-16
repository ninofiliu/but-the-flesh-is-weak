import React from "react";

export default ({
  value,
  setValue,
  name,
}: {
  value: number;
  setValue: (newValue: number) => any;
  name: string;
}) => (
  <div className="control-row">
    <input
      type="range"
      value={value}
      min={0}
      max={1}
      step={0.01}
      onChange={(evt) => setValue(+evt.target.value)}
    />
    <input
      type="number"
      value={value}
      min={0}
      max={1}
      step={0.01}
      onChange={(evt) => setValue(+evt.target.value)}
    />
    {name}
  </div>
);
