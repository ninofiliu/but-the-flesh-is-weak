import { ReadStream } from "node:tty";
import { open } from "node:fs/promises";

const fileHandle = await open("/dev/ttyACM0");
const stream = new ReadStream(fileHandle.fd);
stream.on("data", (buffer) => console.log(buffer.toString()));
