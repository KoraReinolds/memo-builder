export const randomSort = () =>
  [-1, 1].map((factor) => factor * Math.random()).reduce((a, b) => a + b)
