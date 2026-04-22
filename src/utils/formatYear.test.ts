import { describe, it, expect } from 'vitest'
import { formatYear } from './formatYear'

describe('formatYear', () => {
  it('formats positive years as CE', () => {
    expect(formatYear(2024)).toBe('2024 CE')
  })

  it('formats negative years as BCE', () => {
    expect(formatYear(-3000)).toBe('3,000 BCE')
  })

  it('formats year 0 as CE', () => {
    expect(formatYear(0)).toBe('0 CE')
  })

  it('formats -1 as 1 BCE', () => {
    expect(formatYear(-1)).toBe('1 BCE')
  })

  it('formats large negative years with locale separators', () => {
    expect(formatYear(-400000)).toBe('400,000 BCE')
  })

  it('formats small positive years without separator', () => {
    expect(formatYear(100)).toBe('100 CE')
  })
})
