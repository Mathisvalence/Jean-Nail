import {heightRatios} from '@/lib/scale'

import type {COLLECTION_QUERY_RESULT} from '../../sanity.types'
import {sanityFetch} from './fetch'
import {COLLECTION_QUERY, HOME_QUERY} from './queries'

/** Œuvre prête à être affichée : tous les champs indispensables sont présents. */
export type DisplayArtwork = {
  id: string
  slug: string
  href: string
  title: string
  width: number
  height: number
  /** Hauteur rapportée à la plus haute œuvre de la collection (voir lib/scale.ts). */
  heightRatio: number
  price: number | null
  status: string | null
  description: string | null
  image: {url: string; alt: string; lqip?: string | null}
}

export type DisplayCollection = {
  name: string
  slug: string
  artworks: DisplayArtwork[]
}

type RawArtwork = NonNullable<COLLECTION_QUERY_RESULT>['artworks'][number]
type CompleteArtwork = RawArtwork & {
  slug: string
  width: number
  height: number
  image: {alt: string | null; asset: {url: string; metadata: {lqip: string | null} | null}}
}

function isComplete(artwork: RawArtwork): artwork is CompleteArtwork {
  return Boolean(artwork.slug && artwork.width && artwork.height && artwork.image?.asset?.url)
}

/**
 * Œuvres affichables d'une collection, avec leur échelle commune.
 * Une œuvre sans slug, dimensions ou photo est écartée plutôt que de casser la page.
 */
export function toDisplayArtworks(
  collectionSlug: string,
  rawArtworks: readonly RawArtwork[],
): DisplayArtwork[] {
  const artworks = rawArtworks.filter(isComplete)
  const ratios = heightRatios(artworks)
  return artworks.map((artwork, index) => ({
    id: artwork._id,
    slug: artwork.slug,
    href: `/collections/${collectionSlug}/${artwork.slug}`,
    title: artwork.title ?? 'Sans titre',
    width: artwork.width,
    height: artwork.height,
    heightRatio: ratios[index],
    price: artwork.price,
    status: artwork.status,
    description: artwork.description,
    image: {
      url: artwork.image.asset.url,
      alt: artwork.image.alt ?? artwork.title ?? '',
      lqip: artwork.image.asset.metadata?.lqip,
    },
  }))
}

/**
 * Collection et ses œuvres affichables, dans l'ordre choisi dans le Studio.
 * La requête est mise en cache : les pages Collection et Œuvre la partagent.
 */
export async function getCollection(slug: string): Promise<DisplayCollection | null> {
  const collection = await sanityFetch(COLLECTION_QUERY, {slug})
  if (!collection?.name || !collection.slug) return null
  return {
    name: collection.name,
    slug: collection.slug,
    artworks: toDisplayArtworks(collection.slug, collection.artworks),
  }
}

export type HomeCollection = {
  id: string
  name: string
  href: string
  count: number
  /** Accrochage de l'accueil : une grande œuvre puis deux petites. */
  hang: DisplayArtwork[]
}

/** Collections de l'accueil avec leur accrochage (œuvres mises en avant, sinon les premières). */
export async function getHomeCollections(): Promise<HomeCollection[]> {
  const collections = await sanityFetch(HOME_QUERY)
  return collections.flatMap((collection) => {
    if (!collection.name || !collection.slug) return []
    const featured = toDisplayArtworks(collection.slug, collection.featured)
    const hang =
      featured.length > 0 ? featured : toDisplayArtworks(collection.slug, collection.firstArtworks)
    return [
      {
        id: collection._id,
        name: collection.name,
        href: `/collections/${collection.slug}`,
        count: collection.count,
        hang: hang.slice(0, 3),
      },
    ]
  })
}
