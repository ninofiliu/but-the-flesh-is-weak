export const randomPick = <T>(arr: T[]) => arr[~~(Math.random() * arr.length)];

export const randomNPick = <T>(arr: T[], n: number) => {
  const from = new Set(arr);
  const to = new Set<T>();
  while (to.size < n) {
    const choice = [...from.values()][~~(Math.random() * from.size)];
    from.delete(choice);
    to.add(choice);
  }
  return [...to];
};

export const normalize = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((v) => (v - min) / (max - min));
};
