import createCsvStreamProcessor from "./createCsvStreamProcessor";

export default async (cb: (port: SerialPort, evt: number[]) => any) => {
  const decoder = new TextDecoder();
  const ports = await navigator.serial.getPorts();
  ports.forEach(async (port) => {
    console.log(port);
    if (!port.readable) {
      console.log("can not read", port);
      return;
    }
    console.log("can read");
    const reader = port.readable.getReader();

    const csp = createCsvStreamProcessor((evt) => cb(port, evt));
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      csp.addChunk(decoder.decode(value));
    }
  });
};
