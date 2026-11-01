/**
 * Transformation des données brutes (CSV + dossiers de photos) en documents Sanity.
 * Fonctions pures, sans accès réseau ni disque : elles sont testées dans artworks.test.ts.
 */

export type CsvRow = Record<string, string>

export type CollectionSeed = {
  /** Nom du dossier de photos sur le disque. */
  folder: string
  name: string
  slug: string
  order: number
  /** Numéros d'inventaire des trois œuvres de l'accrochage d'accueil (la première est la grande). */
  featured: string[]
}

/**
 * Les 7 collections, dans l'ordre et avec les œuvres mises en avant des maquettes validées.
 * Les noms de dossiers sont ceux du Mac (« noir et blanc » se termine par une espace).
 */
export const COLLECTIONS: readonly CollectionSeed[] = [
  {
    folder: 'noir et blanc ',
    name: 'Noir et blanc',
    slug: 'noir-et-blanc',
    order: 1,
    featured: ['49', '47', '25'],
  },
  {folder: 'INSOLITE', name: 'Insolite', slug: 'insolite', order: 2, featured: ['18', '26', '31']},
  {folder: 'SOUVENIR', name: 'Souvenir', slug: 'souvenir', order: 3, featured: ['11', '7', '9']},
  {
    folder: 'SERIE NOIRE',
    name: 'Série noire',
    slug: 'serie-noire',
    order: 4,
    featured: ['24', '2', '28'],
  },
  {
    folder: 'VIE COLOREE',
    name: 'Vie colorée',
    slug: 'vie-coloree',
    order: 5,
    featured: ['13', '16', '19'],
  },
  {
    folder: 'CAPHARNAÜM',
    name: 'Capharnaüm',
    slug: 'capharnaum',
    order: 6,
    featured: ['10', '1', '12'],
  },
  {
    folder: 'collection privée',
    name: 'Collection privée',
    slug: 'collection-privee',
    order: 7,
    featured: ['51', '71'],
  },
]

/** Côté long par défaut (cm) quand le CSV ne donne pas de dimensions. */
export const DEFAULT_LONG_SIDE_CM = 40

export const PLACEHOLDER_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Description à compléter.'

/** « Jean NAIL-45bis.jpg » → « 45bis ». */
export function inventoryNumberFromFilename(filename: string): string {
  const match = /^Jean NAIL-(.+)\.jpe?g$/i.exec(filename.normalize('NFC').trim())
  if (!match) {
    throw new Error(
      `Nom de photo inattendu : « ${filename} » (attendu : « Jean NAIL-<numéro>.jpg »).`,
    )
  }
  return match[1]
}

/** Identifiant Sanity stable d'une œuvre, pour pouvoir relancer l'import sans doublons. */
export function artworkId(inventoryNumber: string): string {
  return `artwork-${inventoryNumber.toLowerCase()}`
}

export function collectionId(slug: string): string {
  return `collection-${slug}`
}

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined
  const number = Number(value.replace(',', '.').replace(/\s/g, ''))
  return Number.isFinite(number) && number > 0 ? number : undefined
}

export type Dimensions = {width: number; height: number}

/**
 * Le CSV donne deux côtés et une orientation (« Format ») : les colonnes ne disent pas
 * toujours laquelle est la largeur. On se fie donc à l'orientation, puis au ratio de la photo.
 */
export function resolveDimensions(
  row: CsvRow,
  imagePixels?: Dimensions,
): {dimensions: Dimensions; estimated: boolean} {
  const a = toNumber(row['Hauteur (cm)'])
  const b = toNumber(row['Largeur (cm)'])
  const format = (row['Format'] ?? '').normalize('NFC').toLowerCase()
  const photoIsLandscape = imagePixels ? imagePixels.width > imagePixels.height : undefined

  if (a && b) {
    const long = Math.max(a, b)
    const short = Math.min(a, b)
    const landscape =
      format === 'horizontal' ? true : format === 'portrait' ? false : (photoIsLandscape ?? false)
    return {
      dimensions: landscape ? {width: long, height: short} : {width: short, height: long},
      estimated: false,
    }
  }

  // Dimensions inconnues : côté long par défaut, l'autre déduit du ratio de la photo.
  if (imagePixels && imagePixels.width > 0 && imagePixels.height > 0) {
    const ratio = imagePixels.width / imagePixels.height
    const dimensions =
      ratio >= 1
        ? {width: DEFAULT_LONG_SIDE_CM, height: Math.round(DEFAULT_LONG_SIDE_CM / ratio)}
        : {width: Math.round(DEFAULT_LONG_SIDE_CM * ratio), height: DEFAULT_LONG_SIDE_CM}
    return {dimensions, estimated: true}
  }
  return {dimensions: {width: DEFAULT_LONG_SIDE_CM, height: DEFAULT_LONG_SIDE_CM}, estimated: true}
}

/**
 * Prix fictif, uniquement pour la période de développement : proportionnel à la surface,
 * arrondi à la centaine. À remplacer par les vrais prix avant la mise en ligne.
 */
export function placeholderPrice({width, height}: Dimensions): number {
  return Math.max(300, Math.round((width * height * 0.6) / 100) * 100)
}

export type ArtworkDraft = {
  _id: string
  _type: 'artwork'
  title: string
  slug: {_type: 'slug'; current: string}
  collection: {_type: 'reference'; _ref: string}
  width: number
  height: number
  price: number
  status: 'available'
  description: string
  order: number
  year?: number
  medium?: string
  inventoryNumber: string
}

export type BuildResult = {
  artwork: ArtworkDraft
  /** Champs remplis avec du contenu fictif, à vérifier avant la mise en ligne. */
  placeholders: string[]
}

export function buildArtwork(params: {
  inventoryNumber: string
  row: CsvRow | undefined
  collection: CollectionSeed
  order: number
  imagePixels?: Dimensions
}): BuildResult {
  const {inventoryNumber, row = {}, collection, order, imagePixels} = params
  const placeholders: string[] = ['titre', 'prix', 'description']

  const {dimensions, estimated} = resolveDimensions(row, imagePixels)
  if (estimated) placeholders.push('dimensions')

  const year = toNumber(row['Année'])
  const medium = row['Medium'] || undefined
  const slug = `sans-titre-${inventoryNumber.toLowerCase()}`

  return {
    artwork: {
      _id: artworkId(inventoryNumber),
      _type: 'artwork',
      title: `Sans titre n°${inventoryNumber}`,
      slug: {_type: 'slug', current: slug},
      collection: {_type: 'reference', _ref: collectionId(collection.slug)},
      width: dimensions.width,
      height: dimensions.height,
      price: placeholderPrice(dimensions),
      status: 'available',
      description: PLACEHOLDER_DESCRIPTION,
      order,
      ...(year ? {year: Math.round(year)} : {}),
      ...(medium ? {medium} : {}),
      inventoryNumber,
    },
    placeholders,
  }
}

/** Tri naturel des numéros d'inventaire : 2 < 10 < 45 < 45bis < 46. */
export function compareInventoryNumbers(a: string, b: string): number {
  return a.localeCompare(b, 'fr', {numeric: true})
}
