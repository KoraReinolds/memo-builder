// @vitest-environment node
import { test, describe, expect } from 'vitest'
import { repository } from '~/core/repository/implementation'

type Item = { id: number; extra?: any }
const items: Item[] = [{ id: 1 }, { id: 2 }]

describe('repository', () => {
  describe('select', () => {
    test('select nothing', () => {
      const selected = repository.select(items, [])
      expect(selected).toEqual([])
    })
    test('select not existing value', () => {
      const selected = repository.select(items, [3])
      expect(selected).toEqual([])
    })
    test('select one existing value', () => {
      const selected = repository.select(items, [1])
      expect(selected).toEqual([items[0]])
    })
    test('select all existing values', () => {
      const selected = repository.select(items, [1, 2])
      expect(selected).toEqual(expect.arrayContaining(items))
      expect(selected).not.toBe(items)
    })
  })
  describe('add', () => {
    test('add nothing', () => {
      const added = repository.add(items, [])
      expect(added).toEqual(expect.arrayContaining(items))
      expect(added).not.toBe(items)
    })
    test('add new value', () => {
      const newValue = { id: 3 }
      const added = repository.add(items, [newValue])
      expect(added).toEqual(items.concat(newValue))
    })
  })
  describe('remove', () => {
    test('remove nothing', () => {
      const removed = repository.remove(items, [])
      expect(removed).toEqual(expect.arrayContaining(items))
      expect(removed).not.toBe(items)
    })
    test('remove existing value', () => {
      const removed = repository.remove(items, [2])
      expect(removed).toEqual([items[0]])
    })
    test('remove not existing value', () => {
      const removed = repository.remove(items, [3])
      expect(removed).toEqual(expect.arrayContaining(items))
      expect(removed).not.toBe(items)
    })
  })
  describe('edit', () => {
    const editFunction = (item: Item) => {
      item.extra = 'extra'
      return item
    }
    test('edit nothing', () => {
      const edited = repository.edit(items, [], editFunction)
      expect(edited).toEqual(expect.arrayContaining(items))
      expect(edited).not.toBe(items)
    })
    test('edit existing value', () => {
      const result = [{ id: 1, extra: 'extra' }, items[1]]
      const edited = repository.edit(items, [1], editFunction)
      expect(edited).toEqual(result)
      expect(edited[1]).toBe(result[1])
    })
    test('edit not existing value', () => {
      const edited = repository.edit(items, [3], editFunction)
      expect(edited).toEqual(items)
      expect(edited).not.toBe(items)
    })
  })
})
