import { hashCode, arrayAbsMax, formatDate, makePath } from './math'

test('hashCode', () => {
  expect(hashCode('test')).toBe(3556498)
  expect(hashCode('something')).toBe(-564885382)
})

test('arrayMax', () => {
  expect(arrayAbsMax([1, 2, 3, 4, 5])).toBe(5)
  expect(arrayAbsMax([2, 1, 100, -5, -5000, 1000])).toBe(5000)
})

test('formatDate', () => {
  expect(formatDate(new Date('5/1/2020, 4:30:09 PM'))).toBe(
    '16:30 EDT on 01.05.2020'
  )
  expect(formatDate(new Date('5/1/2020, 4:30:09 AM'))).toBe(
    '04:30 EDT on 01.05.2020'
  )
})

test('makePath', () => {
  expect(
    makePath([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 2 },
    ])
  ).toBe(
    'M1,1 C1.1666666666666667,1.1666666666666667 1.8333333333333333,1.8333333333333333 2,2 C2.1666666666666665,2.1666666666666665 2,2 2,2 '
  )
})
