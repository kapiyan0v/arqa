import { formatCurrency, formatDate } from '../utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(123456)).toBe('123 456 ₸')
      expect(formatCurrency(0)).toBe('0 ₸')
      expect(formatCurrency(1000)).toBe('1 000 ₸')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      expect(formatDate('2025-01-15')).toBe('15 янв. 2025 г.')
    })
  })
})
