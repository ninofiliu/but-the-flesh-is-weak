import React, { useEffect } from "react";
import { useState } from "react";
import Status from "./Status";

export default () => {
  const [ports, setPorts] = useState<SerialPort[]>([]);

  const supported = "serial" in navigator;

  useEffect(() => {
    (async () => {
      if (!supported) return;
      setPorts(await navigator.serial.getPorts());
    })();
  }, []);

  return <Status supported={supported} ports={ports} />;
};
