import createCsvStreamProcessor from "./createCsvStreamProcessor";

export default async (cb: (port: SerialPort, evt: number[]) => any) => {
  const decoder = new TextDecoder();
  const ports = await navigator.serial.getPorts();
  for (const port of ports) {
    if (!port.readable) throw new Error("can not read");
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
  }
};
