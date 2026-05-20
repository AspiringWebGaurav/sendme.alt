import { describe, it, expect } from 'vitest'
import { generateToken, isValidToken, tokenToFirebaseKey } from '@/core/token/token'

describe('generateToken', () => {
  it('returns a string of lowercase letters only', () => {
    for (let i = 0; i < 100; i++) {
      const token = generateToken()
      expect(token).toMatch(/^[a-z]+$/)
    }
  })

  it('returns a token of at least 6 characters (two words combined)', () => {
    for (let i = 0; i < 100; i++) {
      const token = generateToken()
      expect(token.length).toBeGreaterThanOrEqual(6)
    }
  })

  it('returns a token of at most 30 characters', () => {
    for (let i = 0; i < 100; i++) {
      const token = generateToken()
      expect(token.length).toBeLessThanOrEqual(30)
    }
  })

  it('generates different tokens across calls (probabilistic)', () => {
    const tokens = new Set<string>()
    for (let i = 0; i < 50; i++) {
      tokens.add(generateToken())
    }
    // With 250K combinations, 50 calls should produce mostly unique
    expect(tokens.size).toBeGreaterThan(1)
  })
})

describe('isValidToken', () => {
  it('accepts valid lowercase word-combo tokens', () => {
    expect(isValidToken('happycloud')).toBe(true)
    expect(isValidToken('oceanriver')).toBe(true)
    expect(isValidToken('abcedfx')).toBe(true)
  })

  it('accepts tokens with surrounding whitespace', () => {
    expect(isValidToken('  happycloud  ')).toBe(true)
  })

  it('rejects tokens shorter than 6 characters', () => {
    expect(isValidToken('abc')).toBe(false)
    expect(isValidToken('ab')).toBe(false)
  })

  it('rejects tokens longer than 30 characters', () => {
    expect(isValidToken('a'.repeat(31))).toBe(false)
  })

  it('rejects tokens with uppercase characters', () => {
    expect(isValidToken('HappyCloud')).toBe(true) // toLowerCase normalizes
  })

  it('rejects tokens with non-alpha characters', () => {
    expect(isValidToken('happy123')).toBe(false)
    expect(isValidToken('happy-cloud')).toBe(false)
    expect(isValidToken('happy cloud')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidToken('')).toBe(false)
    expect(isValidToken('   ')).toBe(false)
  })
})

describe('tokenToFirebaseKey', () => {
  it('lowercases the token', () => {
    expect(tokenToFirebaseKey('HappyCloud')).toBe('happycloud')
  })

  it('preserves already-lowercase tokens', () => {
    expect(tokenToFirebaseKey('oceanriver')).toBe('oceanriver')
  })

  it('handles empty string', () => {
    expect(tokenToFirebaseKey('')).toBe('')
  })
})