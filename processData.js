const { readdir, readFile, writeFile } = require("node:fs/promises");

(async () => {
  const names = await readdir("./data");
  const data = await Promise.all(
    names
      .filter((name) => name.endsWith(".dat.csv"))
      .map((name) =>
        (async () => {
          const content = await readFile(`./data/${name}`, "utf8");
          const matrix = content
            .split("\n")
            .slice(0, -1)
            .map((line) => line.split(",").map((value) => +value));
          return matrix;
        })()
      )
  );
  await writeFile("./src/data.json", JSON.stringify(data));
})();
