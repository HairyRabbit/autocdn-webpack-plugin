/**
 * @jest
 */

test('should push item to array', () => {
  const pushToArray = require('../src/pushToArray').default
  const arr = []
  pushToArray('foo', 'bar', arr)
  expect(arr).toEqual([{
    name: 'bar',
    url: 'foo'
  }])
})

test('should push item to array when array has multi items', () => {
  const pushToArray = require('../src/pushToArray').default
  const arr = []
  pushToArray(['foo', 'bar'], 'baz', arr)
  expect(arr).toEqual([{
    name: 'baz@0',
    url: 'foo'
  },{
    name: 'baz@1',
    url: 'bar'
  }])
})

test('should push item to array when array was empty', () => {
  const pushToArray = require('../src/pushToArray').default
  const arr = []
  pushToArray([], 'foo', arr)
  expect(arr).toEqual([])
})

test('should do nothing when list was nullable', () => {
  const pushToArray = require('../src/pushToArray').default
  const arr = []
  pushToArray(null, 'foo', arr)
  expect(arr).toEqual([])
})
