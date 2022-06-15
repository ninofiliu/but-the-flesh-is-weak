import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import listen from "./listen";
import mockListen from "./mockListen";
import Status from "./Status";

const Machine = ({
  maybePort,
  portIndex,
}: {
  maybePort: SerialPort | null;
  portIndex: number;
}) => {
  const [touchRaw, setTouchRaw] = useState(0);

  const onData = (ns: number[]) => {
    setTouchRaw(ns[1]);
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
      <h1>Machine {portIndex}</h1>
      <Graph title="Raw data" values={{ red: touchRaw }} min={0} max={1024} />
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
