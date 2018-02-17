/**
 * @jest
 */

test('should report', () => {
  const mockLog = jest.fn()
  console.log = mockLog
  const { default: resultReporter, DefaultResults } = require('../src/resultReporter')
  resultReporter()
  expect(mockLog).toHaveBeenCalled()
})

test('should report noPath result', () => {
  let out = ''
  const mockLog = jest.fn(str => out += str)
  console.log = mockLog
  const { default: resultReporter, DefaultResults } = require('../src/resultReporter')
  resultReporter({ ...DefaultResults, noPath: ['foo'] })
  expect(out).toMatch('file not found')
})

test('should report noName result', () => {
  let out = ''
  const mockLog = jest.fn(str => out += str)
  console.log = mockLog
  const { default: resultReporter, DefaultResults } = require('../src/resultReporter')
  resultReporter({ ...DefaultResults, noName: ['foo'] })
  expect(out).toMatch('global name')
})

test('should report noUrl result', () => {
  let out = ''
  const mockLog = jest.fn(str => out += str)
  console.log = mockLog
  const { default: resultReporter, DefaultResults } = require('../src/resultReporter')
  resultReporter({ ...DefaultResults, noUrl: ['foo'] })
  expect(out).toMatch('url not resolved')
})

test('should report css result', () => {
  let out = ''
  const mockLog = jest.fn(str => out += str)
  console.log = mockLog
  const { default: resultReporter, DefaultResults } = require('../src/resultReporter')
  resultReporter({ ...DefaultResults, css: ['foo'] })
  expect(out).toMatch('as links')
})

test('should report js result', () => {
  let out = ''
  const mockLog = jest.fn(str => out += str)
  console.log = mockLog
  const { default: resultReporter, DefaultResults } = require('../src/resultReporter')
  resultReporter({ ...DefaultResults, js: ['foo'] })
  expect(out).toMatch('as scripts')
})
