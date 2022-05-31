const { readdir, writeFile } = require("fs/promises");

(async () => {
  const dir = await readdir("./public/stakes");
  const txt = JSON.stringify(dir);
  await writeFile("./src/stakes.json", txt);
})();
