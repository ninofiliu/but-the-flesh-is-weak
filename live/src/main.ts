export {};

const button = document.createElement("button");
button.textContent = "Click me";
button.addEventListener("click", async () => {
  await navigator.serial.requestPort();
});
document.body.append(button);

const decoder = new TextDecoder();

(async () => {
  const [port] = await navigator.serial.getPorts();
  await port.open({ baudRate: 9600 });
  if (!port.readable) throw new Error("can not read");
  const reader = port.readable.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    console.log(value.length, decoder.decode(value));
  }
})();
