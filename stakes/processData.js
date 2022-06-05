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
          const measurement = [];
          for (const column in matrix[0]) {
            const values = matrix.map((row) => row[column]);
            if (values.some((value) => Number.isNaN(value))) continue;
            const min = Math.min(...values);
            const max = Math.max(...values);
            if (min === max) continue;
            measurement.push(values);
          }
          return measurement;
        })()
      )
  );
  await writeFile("./src/data.json", JSON.stringify(data));
})();
