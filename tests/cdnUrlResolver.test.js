/**
 * @jest
 */

import resolve from '../src/cdnUrlResolver'

beforeEach(() => {
  jest.resetModules()
})

test('should resolve filePath', () => {
  return expect(resolve('react', '^16.3.0-alpha.0', 'umd/react.production.min.js')).resolves.toBe('https://unpkg.com/react@16.3.0-alpha.0/umd/react.production.min.js')
})

test('should resolve filePath by fuzzy version number', () => {
  return expect(resolve('react', '16', 'umd/react.production.min.js')).resolves.toBe('https://unpkg.com/react@16.2.0/umd/react.production.min.js')
})

test('should resolve filePath by fuzzy version number', () => {
  return expect(resolve('react', '42', 'umd/react.production.min.js')).resolves.toBe(null)
})

test('should reject when request error', () => {
  jest.doMock('request', () => {
    return (_, cb) => cb(42)
  })
  const resolve = require('../src/cdnUrlResolver').default
  return expect(resolve('foo')).rejects.toBe(42)
})

test('should return path when 200 OK', () => {
  jest.doMock('request', () => {
    return (_, cb) => cb(null, { statusCode: 200 })
  })
  const resolve = require('../src/cdnUrlResolver').default
  return expect(resolve('foo', 42, 'bar')).resolves.toBe('https://unpkg.com/foo@42/bar')
})
