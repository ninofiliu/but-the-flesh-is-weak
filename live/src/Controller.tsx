import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import listen from "./listen";
import mockListen from "./mockListen";

export default ({
  maybePort,
  portIndex,
}: {
  maybePort: SerialPort | null;
  portIndex: number;
}) => {
  const [data, setData] = useState<number[]>([]);

  const onData = (ns: number[]) => {
    setData(ns);
  };

  useEffect(() => {
    (async () => {
      if (maybePort) {
        listen(maybePort, onData);
      } else {
        mockListen(onData);
      }
    })();
  }, []);

  return (
    <>
      <h1>Port {portIndex}</h1>
      {data.length && (
        <Graph
          values={{ blue: data[0], red: data[1] }}
          title="Raw data"
          min={0}
          max={1024}
        />
      )}
    </>
  );
};
