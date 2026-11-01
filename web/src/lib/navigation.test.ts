import {describe, expect, it} from 'vitest'

import {neighbours, swipeDirection} from './navigation'

const items = [{slug: 'a'}, {slug: 'b'}, {slug: 'c'}]

describe('neighbours', () => {
  it('donne les œuvres voisines', () => {
    expect(neighbours(items, 'b')).toEqual({index: 1, previous: {slug: 'a'}, next: {slug: 'c'}})
  })

  it('ne boucle pas aux extrémités', () => {
    expect(neighbours(items, 'a').previous).toBeNull()
    expect(neighbours(items, 'c').next).toBeNull()
  })

  it('renvoie -1 pour une œuvre absente', () => {
    expect(neighbours(items, 'z')).toEqual({index: -1, previous: null, next: null})
  })
})

describe('swipeDirection', () => {
  it('avance quand on glisse vers la gauche', () => {
    expect(swipeDirection(-80, 10)).toBe('next')
  })

  it('recule quand on glisse vers la droite', () => {
    expect(swipeDirection(80, -10)).toBe('previous')
  })

  it('ignore les gestes courts ou verticaux', () => {
    expect(swipeDirection(-30, 0)).toBeNull()
    expect(swipeDirection(-80, 120)).toBeNull()
  })
})
