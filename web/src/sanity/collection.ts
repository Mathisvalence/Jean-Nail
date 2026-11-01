import {heightRatios} from '@/lib/scale'

import type {COLLECTION_QUERY_RESULT} from '../../sanity.types'
import {sanityFetch} from './fetch'
import {COLLECTION_QUERY} from './queries'

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
 * Collection et ses œuvres affichables, dans l'ordre choisi dans le Studio.
 * Une œuvre sans slug, dimensions ou photo est écartée plutôt que de casser la page.
 * La requête est mise en cache : les pages Collection et Œuvre la partagent.
 */
export async function getCollection(slug: string): Promise<DisplayCollection | null> {
  const collection = await sanityFetch(COLLECTION_QUERY, {slug})
  if (!collection?.name || !collection.slug) return null

  const artworks = collection.artworks.filter(isComplete)
  const ratios = heightRatios(artworks)

  return {
    name: collection.name,
    slug: collection.slug,
    artworks: artworks.map((artwork, index) => ({
      id: artwork._id,
      slug: artwork.slug,
      href: `/collections/${collection.slug}/${artwork.slug}`,
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
    })),
  }
}
