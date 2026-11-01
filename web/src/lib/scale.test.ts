import {describe, expect, it} from 'vitest'

import {displaySize, wallScale} from './scale'

describe('wallScale', () => {
  it('fait tenir la plus haute œuvre dans la hauteur disponible', () => {
    const artworks = [
      {width: 50, height: 65},
      {width: 100, height: 130},
      {width: 30, height: 40},
    ]
    const scale = wallScale(artworks, 520)
    expect(scale).toBe(4)
    expect(displaySize(artworks[1], scale).height).toBe(520)
  })

  it('garde les proportions réelles entre les œuvres', () => {
    const artworks = [
      {width: 50, height: 65},
      {width: 100, height: 130},
    ]
    const scale = wallScale(artworks, 600)
    const small = displaySize(artworks[0], scale)
    const large = displaySize(artworks[1], scale)
    expect(large.height / small.height).toBeCloseTo(2, 1)
  })

  it('renvoie 0 pour une collection vide', () => {
    expect(wallScale([], 500)).toBe(0)
  })

  it('refuse une hauteur disponible nulle ou négative', () => {
    expect(() => wallScale([{width: 10, height: 10}], 0)).toThrow(RangeError)
  })
})

describe('displaySize', () => {
  it('arrondit au pixel', () => {
    expect(displaySize({width: 33, height: 41}, 1.5)).toEqual({width: 50, height: 62})
  })
})
