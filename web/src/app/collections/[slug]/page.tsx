import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {CollectionWall, type WallArtwork} from '@/components/CollectionWall'
import {padIndex} from '@/lib/format'
import {heightRatios} from '@/lib/scale'
import {sanityFetch} from '@/sanity/fetch'
import {COLLECTION_QUERY, COLLECTION_SLUGS_QUERY} from '@/sanity/queries'

import styles from './page.module.css'

export async function generateStaticParams() {
  const collections = await sanityFetch(COLLECTION_SLUGS_QUERY)
  return collections.flatMap(({slug}) => (slug ? [{slug}] : []))
}

export async function generateMetadata({
  params,
}: PageProps<'/collections/[slug]'>): Promise<Metadata> {
  const {slug} = await params
  const collection = await sanityFetch(COLLECTION_QUERY, {slug})
  return collection?.name ? {title: collection.name} : {}
}

export default async function CollectionPage({params}: PageProps<'/collections/[slug]'>) {
  const {slug} = await params
  const collection = await sanityFetch(COLLECTION_QUERY, {slug})
  if (!collection?.name) notFound()

  const artworks = collection.artworks.filter(
    (artwork) => artwork.slug && artwork.width && artwork.height && artwork.image?.asset?.url,
  )
  const ratios = heightRatios(artworks.map(({width, height}) => ({width: width!, height: height!})))

  const wallArtworks: WallArtwork[] = artworks.map((artwork, index) => ({
    id: artwork._id,
    href: `/collections/${slug}/${artwork.slug}`,
    title: artwork.title ?? 'Sans titre',
    width: artwork.width!,
    height: artwork.height!,
    heightRatio: ratios[index],
    price: artwork.price ?? null,
    status: artwork.status ?? null,
    description: artwork.description ?? null,
    image: {
      url: artwork.image!.asset!.url!,
      alt: artwork.image?.alt ?? artwork.title ?? '',
      lqip: artwork.image?.asset?.metadata?.lqip,
    },
  }))

  return (
    <main className={styles.main}>
      <div className={styles.heading}>
        <h1 className={styles.title}>
          {collection.name}
          <span className={styles.count}>{padIndex(wallArtworks.length)} œuvres</span>
        </h1>
        <Link href="/" className={styles.back}>
          ← Collections
        </Link>
      </div>
      <CollectionWall artworks={wallArtworks} />
    </main>
  )
}
