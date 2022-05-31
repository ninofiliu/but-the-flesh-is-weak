import untypedStakes from "./stakes.json";

(async () => {
  let blur = 0;
  let threshold = 128;
  let index = 28;

  const stakeNames = untypedStakes as string[];
  const stakeName = stakeNames[index];
  const img = document.createElement("img");
  img.src = `/stakes/${stakeName}`;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;

  const applyControls = () => {
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i++) {
      if (i % 4 === 3) continue;
      imageData.data[i] = imageData.data[i] < threshold ? 0 : 255;
    }
    ctx.filter = "";
    ctx.putImageData(imageData, 0, 0);
    console.log(new Set(imageData.data));
  };
  const controls = document.createElement("div");
  const blurInput = document.createElement("input");
  blurInput.type = "number";
  blurInput.value = `${blur}`;
  blurInput.addEventListener("input", () => {
    blur = +blurInput.value;
    applyControls();
  });
  const thresholdInput = document.createElement("input");
  thresholdInput.type = "range";
  thresholdInput.min = "0";
  thresholdInput.max = "256";
  thresholdInput.value = `${threshold}`;
  thresholdInput.addEventListener("input", () => {
    threshold = +thresholdInput.value;
    applyControls();
  });
  applyControls();

  controls.append(blurInput, thresholdInput);
  document.body.append(controls, canvas);

  document.addEventListener("keypress", (evt) => {
    if (evt.key !== "s") return;
    const a = document.createElement("a");
    a.download = `processed.${index}-${blur}-${threshold}.png`;
    a.href = canvas.toDataURL();
    a.click();
  });
})();
