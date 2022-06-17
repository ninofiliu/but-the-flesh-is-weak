import React, { useEffect, useState } from "react";
import Status from "./Status";
import Graph from "./Graph";
import useListen from "./useListen";
import MinMax from "./MinMax";
import Threshold from "./Threshold";

const Machine = ({
  maybePort,
  portIndex,
}: {
  maybePort: SerialPort | null;
  portIndex: number;
}) => {
  const { a0, a1 } = useListen(maybePort);

  return (
    <>
      <h1>Machine {portIndex}</h1>
      <Graph
        values={{
          "#00f": a0,
          "#f00": a1,
        }}
      />
      <MinMax name="water" raw={a0} />
      <Threshold name="touch" raw={a1} threshold={0.75} />
    </>
  );
};

export default () => {
  const supported = "serial" in navigator;
  const [maybePorts, setMaybePorts] = useState<SerialPort[] | null[]>([]);

  useEffect(() => {
    (async () => {
      if (supported) {
        setMaybePorts(await navigator.serial.getPorts());
      } else {
        setMaybePorts([null]);
      }
    })();
  }, []);

  return (
    <>
      <Status supported={supported} />
      {maybePorts.map((maybePorts, portIndex) => (
        <Machine key={portIndex} portIndex={portIndex} maybePort={maybePorts} />
      ))}
    </>
  );
};
