import { describe, it, expect } from 'vitest'
import { generateToken, isValidToken, tokenToFirebaseKey } from '@/core/token/token'

describe('generateToken', () => {
  it('returns a string of exactly 4 lowercase letters', () => {
    for (let i = 0; i < 100; i++) {
      const token = generateToken()
      expect(token).toMatch(/^[a-z]{4}$/)
    }
  })

  it('generates different tokens across calls (probabilistic)', () => {
    const tokens = new Set<string>()
    for (let i = 0; i < 50; i++) {
      tokens.add(generateToken())
    }
    // With 456976 (26^4) combinations, 50 calls should produce mostly unique
    expect(tokens.size).toBeGreaterThan(1)
  })
})

describe('isValidToken', () => {
  it('accepts exactly 4 lowercase letter tokens', () => {
    expect(isValidToken('abcd')).toBe(true)
    expect(isValidToken('zzzz')).toBe(true)
    expect(isValidToken('qwrt')).toBe(true)
  })

  it('accepts tokens with surrounding whitespace', () => {
    expect(isValidToken('  abcd  ')).toBe(true)
  })

  it('rejects tokens shorter than 4 characters', () => {
    expect(isValidToken('abc')).toBe(false)
    expect(isValidToken('ab')).toBe(false)
  })

  it('rejects tokens longer than 4 characters', () => {
    expect(isValidToken('abcde')).toBe(false)
  })

  it('accepts tokens with uppercase characters by normalizing them', () => {
    expect(isValidToken('AbCd')).toBe(true) // toLowerCase normalizes
  })

  it('rejects tokens with non-alpha characters', () => {
    expect(isValidToken('ab12')).toBe(false)
    expect(isValidToken('ab-d')).toBe(false)
    expect(isValidToken('ab c')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidToken('')).toBe(false)
    expect(isValidToken('   ')).toBe(false)
  })
})

describe('tokenToFirebaseKey', () => {
  it('lowercases the token', () => {
    expect(tokenToFirebaseKey('AbCd')).toBe('abcd')
  })

  it('preserves already-lowercase tokens', () => {
    expect(tokenToFirebaseKey('abcd')).toBe('abcd')
  })

  it('handles empty string', () => {
    expect(tokenToFirebaseKey('')).toBe('')
  })
})