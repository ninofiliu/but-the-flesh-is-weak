import React, { useEffect, useState } from "react";

type Values = {
  [color: string]: number;
};

const nbAllValues = 500;
const width = 500;
const height = 250;

export default ({
  values,
  title,
  min,
  max,
}: {
  values: Values;
  title: string;
  min: number;
  max: number;
}) => {
  const [allValues, setAllValues] = useState<Values[]>(
    Array(nbAllValues).fill({})
  );
  const [isHovering, setIsHovering] = useState(false);
  const [hoverX, setHoverX] = useState(0);
  const [hoverY, setHoverY] = useState(0);

  useEffect(() => {
    setAllValues([...allValues.slice(1), values]);
  }, [values]);

  const onMouseMove: React.MouseEventHandler<SVGSVGElement> = (evt) => {
    setHoverX(evt.nativeEvent.offsetX);
    setHoverY(evt.nativeEvent.offsetY);
  };

  const domY = (dataY: number) => height * (1 - (dataY - min) / (max - min));
  const dataY = (domY: number) => max - ((max - min) * domY) / height;
  const dataI = (domX: number) => Math.floor((domX / width) * nbAllValues);

  return (
    <div className="Graph">
      <svg
        width={width}
        height={height}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={onMouseMove}
      >
        {allValues.flatMap((values, i) =>
          Object.entries(values).map(([color, value]) => (
            <rect
              key={`${i}-${color}`}
              x={(width * i) / nbAllValues}
              y={domY(value)}
              width={width / nbAllValues}
              height={1}
              fill={color}
            />
          ))
        )}
        {isHovering && (
          <>
            <rect x={0} y={hoverY} width={width} height={1} fill="grey" />
            <rect x={hoverX} y={0} width={1} height={height} fill="grey" />
          </>
        )}
      </svg>
      <div>
        <div>
          <b>{title}</b>
        </div>
        {isHovering && (
          <>
            <div>{dataY(hoverY)}</div>
            {Object.entries(allValues[dataI(hoverX)]).map(([color, value]) => (
              <div key={color} style={{ color }}>
                {value}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
