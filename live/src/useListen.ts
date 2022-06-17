import { useEffect, useState } from "react";
import listen from "./listen";
import mockListen from "./mockListen";
import { Data } from "./types";

export default (maybePort: SerialPort | null) => {
  const [data, setData] = useState<Data>({
    a0: 0,
    a1: 0,
    a2: 0,
  });

  useEffect(() => {
    (async () => {
      if (maybePort) {
        listen(maybePort, setData);
      } else {
        mockListen(setData);
      }
    })();
  }, []);

  return data;
};
