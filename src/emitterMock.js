(async () => {
  for (let i = 0; i < 10; i++) {
    process.stdout.write(`t = ${i}s\n`);
    await new Promise((r) => setTimeout(r, 1000));
  }
})();
