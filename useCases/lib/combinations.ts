export const choose = <T>(n: number, xs: T[]): T[][] => {
  if (n < 1 || n > xs.length) {
    return []
  } else if (n === 1) {
    return xs.map((x) => [x])
  } else {
    const restCombs = choose(n - 1, xs.slice(1))
    const combsWithFirst = restCombs.map((ys) => [xs[0], ...ys])
    const combsWithoutFirst = choose(n, xs.slice(1))
    return [...combsWithFirst, ...combsWithoutFirst]
  }
}

export const getCombinations = <T>(
  min: number,
  max: number,
  xs: T[],
): T[][] => {
  if (xs.length === 0 || min > max) {
    return []
  } else {
    const combs = []
    for (let n = min; n <= max; n++) {
      combs.push(...choose(n, xs))
    }
    return combs
  }
}
