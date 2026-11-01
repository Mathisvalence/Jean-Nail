import {describe, expect, it} from 'vitest'

import {
  buildArtwork,
  COLLECTIONS,
  compareInventoryNumbers,
  inventoryNumberFromFilename,
  placeholderPrice,
  resolveDimensions,
} from './artworks'
import {parseCsv} from './csv'

describe('parseCsv', () => {
  it('lit les en-têtes et les cellules, y compris vides et entre guillemets', () => {
    const rows = parseCsv(
      'Photo,Titre,Medium\r\nJean NAIL-1.jpg,1,"huile, toile"\nJean NAIL-2.jpg,2,\n',
    )
    expect(rows).toEqual([
      {Photo: 'Jean NAIL-1.jpg', Titre: '1', Medium: 'huile, toile'},
      {Photo: 'Jean NAIL-2.jpg', Titre: '2', Medium: ''},
    ])
  })
})

describe('inventoryNumberFromFilename', () => {
  it('extrait le numéro, suffixe compris', () => {
    expect(inventoryNumberFromFilename('Jean NAIL-45.jpg')).toBe('45')
    expect(inventoryNumberFromFilename('Jean NAIL-45bis.jpg')).toBe('45bis')
  })

  it('refuse un nom inattendu', () => {
    expect(() => inventoryNumberFromFilename('IMG_001.jpg')).toThrow()
  })
})

describe('compareInventoryNumbers', () => {
  it('trie dans l’ordre naturel', () => {
    expect(['10', '45bis', '2', '46', '45'].sort(compareInventoryNumbers)).toEqual([
      '2',
      '10',
      '45',
      '45bis',
      '46',
    ])
  })
})

describe('resolveDimensions', () => {
  it('met le grand côté en largeur pour un format horizontal', () => {
    const row = {'Hauteur (cm)': '70', 'Largeur (cm)': '50', Format: 'Horizontal'}
    expect(resolveDimensions(row).dimensions).toEqual({width: 70, height: 50})
  })

  it('met le grand côté en hauteur pour un format portrait', () => {
    const row = {'Hauteur (cm)': '65', 'Largeur (cm)': '50', Format: 'Portrait'}
    expect(resolveDimensions(row).dimensions).toEqual({width: 50, height: 65})
  })

  it('suit l’orientation de la photo quand le « Format » la contredit', () => {
    const row = {'Hauteur (cm)': '40', 'Largeur (cm)': '30', Format: 'Horizontal'}
    expect(resolveDimensions(row, {width: 1654, height: 2500}).dimensions).toEqual({
      width: 30,
      height: 40,
    })
  })

  it('garde un carré carré', () => {
    const row = {'Hauteur (cm)': '30', 'Largeur (cm)': '30', Format: 'Carré'}
    expect(resolveDimensions(row)).toEqual({dimensions: {width: 30, height: 30}, estimated: false})
  })

  it('estime les dimensions depuis la photo quand le CSV est vide', () => {
    const result = resolveDimensions({}, {width: 2500, height: 2000})
    expect(result).toEqual({dimensions: {width: 40, height: 32}, estimated: true})
  })
})

describe('placeholderPrice', () => {
  it('donne un prix arrondi à la centaine, avec un minimum', () => {
    expect(placeholderPrice({width: 50, height: 65})).toBe(2000)
    expect(placeholderPrice({width: 20, height: 25})).toBe(300)
  })
})

describe('buildArtwork', () => {
  const insolite = COLLECTIONS.find(({slug}) => slug === 'insolite')!

  it('construit un document stable et signale le contenu fictif', () => {
    const {artwork, placeholders} = buildArtwork({
      inventoryNumber: '18',
      row: {'Hauteur (cm)': '30', 'Largeur (cm)': '30', Format: 'Carré', Année: '1977'},
      collection: insolite,
      order: 1,
    })
    expect(artwork).toMatchObject({
      _id: 'artwork-18',
      title: 'Sans titre n°18',
      slug: {current: 'sans-titre-18'},
      collection: {_ref: 'collection-insolite'},
      width: 30,
      height: 30,
      year: 1977,
      inventoryNumber: '18',
      status: 'available',
    })
    expect(placeholders).toEqual(['titre', 'prix', 'description'])
  })
})

describe('COLLECTIONS', () => {
  it('contient 7 collections aux ordres et adresses uniques', () => {
    expect(COLLECTIONS).toHaveLength(7)
    expect(new Set(COLLECTIONS.map(({order}) => order)).size).toBe(7)
    expect(new Set(COLLECTIONS.map(({slug}) => slug)).size).toBe(7)
    for (const {featured} of COLLECTIONS) expect(featured.length).toBeLessThanOrEqual(3)
  })
})
