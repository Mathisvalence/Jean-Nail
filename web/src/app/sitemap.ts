import type {MetadataRoute} from 'next'

import {SITE_URL} from '@/lib/site'
import {sanityFetch} from '@/sanity/fetch'
import {ARTWORK_PATHS_QUERY, COLLECTION_SLUGS_QUERY} from '@/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, artworks] = await Promise.all([
    sanityFetch(COLLECTION_SLUGS_QUERY),
    sanityFetch(ARTWORK_PATHS_QUERY),
  ])

  const paths = [
    '/',
    '/a-propos',
    ...collections.flatMap(({slug}) => (slug ? [`/collections/${slug}`] : [])),
    ...artworks.flatMap(({slug, collection}) =>
      slug && collection ? [`/collections/${collection}/${slug}`] : [],
    ),
  ]
  return paths.map((path) => ({url: `${SITE_URL}${path}`}))
}
