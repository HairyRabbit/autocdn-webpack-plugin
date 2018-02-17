/**
 * @jest
 */

test('should return array by single item', () => {
  const apply = require('../src/arrayOptionApply').default
  expect(apply('foo')).toEqual(['foo'])
})

test('should return array by array', () => {
  const apply = require('../src/arrayOptionApply').default
  expect(apply(['foo'])).toEqual(['foo'])
})
