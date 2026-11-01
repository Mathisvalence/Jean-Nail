import {cacheLife, cacheTag} from 'next/cache'
import type {QueryParams} from 'next-sanity'

import {client} from './client'

/** Toutes les données Sanity portent cette étiquette, pour être revalidées d'un coup. */
export const SANITY_CACHE_TAG = 'sanity'

/**
 * Lecture du contenu publié, mise en cache par Next.js.
 * Le cache est renouvelé à chaque publication dans Sanity (webhook → app/api/revalidate),
 * et toutes les heures au plus tard si le webhook échoue.
 */
export async function sanityFetch<const Query extends string>(
  query: Query,
  params: QueryParams = {},
) {
  'use cache'
  cacheLife('hours')
  cacheTag(SANITY_CACHE_TAG)
  return client.fetch(query, params)
}
