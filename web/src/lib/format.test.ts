import {describe, expect, it} from 'vitest'

import {formatDimensions, padIndex} from './format'

describe('formatDimensions', () => {
  it('écrit largeur × hauteur en centimètres', () => {
    expect(formatDimensions(50, 65)).toBe('50 × 65 cm')
  })
})

describe('padIndex', () => {
  it('écrit les compteurs sur deux chiffres', () => {
    expect(padIndex(2)).toBe('02')
    expect(padIndex(26)).toBe('26')
  })
})
