import {describe, expect, it} from 'vitest'

import {fitWallHeight, heightRatios} from './scale'

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

describe('fitWallHeight', () => {
  const base = {stageWidth: 1440, stageHeight: 600, frame: 120, widestFactor: 0.8}

  it('remplit la hauteur de la scène, moins le cadre et la marge', () => {
    expect(fitWallHeight(base)).toBe(Math.round(600 - 120 - 48))
  })

  it("réduit la hauteur quand l'œuvre la plus large ne tiendrait pas en largeur", () => {
    // Écran de téléphone, œuvre deux fois plus large que haute.
    expect(fitWallHeight({...base, stageWidth: 390, frame: 28, widestFactor: 2})).toBe(
      Math.round((390 * 0.8 - 28) / 2),
    )
  })

  it('ne descend jamais sous 120 px', () => {
    expect(fitWallHeight({...base, stageHeight: 100})).toBe(120)
  })
})
