import {describe, expect, it} from 'vitest'

import {heightRatios} from './scale'

describe('heightRatios', () => {
  it('donne 1 à la plus haute œuvre et des ratios proportionnels aux autres', () => {
    expect(
      heightRatios([
        {width: 50, height: 65},
        {width: 100, height: 130},
        {width: 30, height: 39},
      ]),
    ).toEqual([0.5, 1, 0.3])
  })

  it('garde les proportions réelles quelle que soit la largeur', () => {
    const [a, b] = heightRatios([
      {width: 200, height: 40},
      {width: 20, height: 40},
    ])
    expect(a).toBe(b)
  })

  it('renvoie une liste vide pour une collection vide', () => {
    expect(heightRatios([])).toEqual([])
  })

  it('ne casse pas sur des hauteurs nulles', () => {
    expect(heightRatios([{width: 10, height: 0}])).toEqual([0])
  })
})
