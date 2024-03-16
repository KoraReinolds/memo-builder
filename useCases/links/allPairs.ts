import { getCombinations } from '../lib/combinations'
import { isLinks } from '~/server/typeGuards'

export const getAllPairs = (arr: number[]): [number, number][] => {
  const res = getCombinations(2, 2, arr)
  if (isLinks(res)) return res
  else throw new Error('Pairs is not properly formatted')
}
