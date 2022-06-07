export default (cb: (evt: number[]) => any) => {
  let evt = [] as number[];
  let numberStr = "";

  return {
    addChunk(chunk: string) {
      for (const letter of chunk) {
        if (letter === "\n" || letter === ",") {
          evt.push(+numberStr);
          numberStr = "";
          if (letter === "\n") {
            cb(evt);
            evt = [];
          }
        } else {
          numberStr += letter;
        }
      }
    },
  };
};
