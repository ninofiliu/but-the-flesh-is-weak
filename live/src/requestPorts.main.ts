export {};

const button = document.createElement("button");
button.textContent = "Request ports";
button.addEventListener("click", async () => {
  await navigator.serial.requestPort();
  console.log("ok");
});
document.body.append(button);
