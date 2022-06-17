import React, { useEffect, useRef, useState } from "react";

type Values = {
  [color: string]: number;
};

const nbAllValues = 128;
const width = 256;
const height = 128;

export default ({ values }: { values: Values }) => {
  const allValues = useRef<Values[]>(Array(nbAllValues).fill({}));
  const [isHovering, setIsHovering] = useState(false);
  const [hoverX, setHoverX] = useState(0);
  const [hoverY, setHoverY] = useState(0);

  allValues.current = [...allValues.current.slice(1), values];

  const onMouseMove: React.MouseEventHandler<SVGSVGElement> = (evt) => {
    setHoverX(evt.nativeEvent.offsetX);
    setHoverY(evt.nativeEvent.offsetY);
  };

  const domY = (dataY: number) => height * (1 - dataY);
  const dataY = (domY: number) => 1 - domY / height;
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
        {allValues.current.flatMap((values, i) =>
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
      {isHovering && (
        <div>
          <div>{dataY(hoverY)}</div>
          {Object.entries(allValues.current[dataI(hoverX)])
            .sort(([, valueA], [, valueB]) => valueB - valueA)
            .map(([color, value]) => (
              <div key={color} style={{ color }}>
                {value}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
