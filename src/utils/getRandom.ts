export const getRandom = (start: number, end: number) =>
  Math.floor(Math.random() * (end - start) + start);
