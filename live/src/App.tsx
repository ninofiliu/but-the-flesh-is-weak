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
  const [opened, setOpened] = useState(true);
  const { a0, a1, a2 } = useListen(maybePort);

  return (
    <>
      <h1 onClick={() => setOpened(!opened)}>Machine {portIndex}</h1>
      {opened && (
        <>
          <Graph
            values={{
              "#00f": a0,
              "#f00": a1,
              "#0c0": a2,
            }}
          />
          <MinMax name="water" raw={a0} />
          <Threshold name="touch" raw={a1} threshold={0.75} />
          <MinMax name="flex" raw={a2} />
        </>
      )}
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
