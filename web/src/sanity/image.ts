import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

/** Construit l'URL d'une image Sanity (redimensionnement, format WebP/AVIF automatique). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format')
}
