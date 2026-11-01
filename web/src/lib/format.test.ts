import {describe, expect, it} from 'vitest'

import {formatArtworkMeta, formatPrice, padIndex} from './format'

describe('formatPrice', () => {
  it('formate en euros, sans décimales, avec espace insécable', () => {
    expect(formatPrice(4800).replace(/\s/g, ' ')).toBe('4 800 €')
  })
})

describe('padIndex', () => {
  it('écrit les compteurs sur deux chiffres', () => {
    expect(padIndex(2)).toBe('02')
    expect(padIndex(26)).toBe('26')
  })
})

describe('formatArtworkMeta', () => {
  const base = {width: 50, height: 65}

  it('affiche dimensions et prix', () => {
    expect(formatArtworkMeta({...base, price: 1800, status: 'available'}).replace(/\s/g, ' ')).toBe(
      '50 × 65 cm — 1 800 €',
    )
  })

  it("n'affiche que les dimensions pour une œuvre vendue", () => {
    expect(formatArtworkMeta({...base, price: 1800, status: 'sold'})).toBe('50 × 65 cm')
  })

  it('n’affiche que les dimensions sans prix', () => {
    expect(formatArtworkMeta({...base, price: null})).toBe('50 × 65 cm')
  })
})
