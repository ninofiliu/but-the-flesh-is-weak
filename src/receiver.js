(async () => {
    for await (const chunk of process.stdin) process.stdout.write(`stdin says: ${chunk.toString('utf8')}`)
})()