/**
 * @jest
 */

import resolve from '../src/cdnUrlResolver'

test('should resolve filePath', () => {
  return expect(resolve('react', '^16.3.0-alpha.0', 'umd/react.production.min.js')).resolves.toBe('https://unpkg.com/react@16.3.0-alpha.0/umd/react.production.min.js')
})

test('should resolve filePath by fuzzy version number', () => {
  return expect(resolve('react', '16', 'umd/react.production.min.js')).resolves.toBe('https://unpkg.com/react@16.2.0/umd/react.production.min.js')
})

test('should resolve filePath by fuzzy version number', () => {
  return expect(resolve('react', '42', 'umd/react.production.min.js')).resolves.toBe(null)
})
