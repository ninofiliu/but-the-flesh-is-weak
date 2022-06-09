import React, { useEffect, useState } from "react";
import Controller from "./Controller";
import Status from "./Status";

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
      {maybePorts.map((maybePort, portIndex) => (
        <Controller
          key={portIndex}
          maybePort={maybePort}
          portIndex={portIndex}
        />
      ))}
    </>
  );
};
