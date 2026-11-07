import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {ArtworkViewer} from '@/components/ArtworkViewer'
import {FramedArtwork} from '@/components/FramedArtwork'
import {PageFade} from '@/components/PageFade'
import {formatDimensions, padIndex} from '@/lib/format'
import {neighbours} from '@/lib/navigation'
import {getCollection} from '@/sanity/collection'
import {sanityFetch} from '@/sanity/fetch'
import {ARTWORK_PATHS_QUERY} from '@/sanity/queries'

import styles from './page.module.css'

type Params = PageProps<'/collections/[slug]/[artwork]'>['params']

export async function generateStaticParams() {
  const paths = await sanityFetch(ARTWORK_PATHS_QUERY)
  return paths.flatMap(({slug, collection}) =>
    slug && collection ? [{slug: collection, artwork: slug}] : [],
  )
}

async function getArtwork(params: Params) {
  const {slug, artwork: artworkSlug} = await params
  const collection = await getCollection(slug)
  if (!collection) return null
  const {index, previous, next} = neighbours(collection.artworks, artworkSlug)
  if (index === -1) return null
  return {collection, artwork: collection.artworks[index], index, previous, next}
}

export async function generateMetadata({
  params,
}: PageProps<'/collections/[slug]/[artwork]'>): Promise<Metadata> {
  const result = await getArtwork(params)
  if (!result) return {}
  const {artwork, collection} = result
  return {
    title: `${artwork.title} — ${collection.name}`,
    description: `${artwork.title}, ${formatDimensions(artwork.width, artwork.height)}.`,
    // Aperçu de partage : la photo de l'œuvre, à 1200 px de large.
    openGraph: {
      images: [{url: `${artwork.image.url}?w=1200&fit=max&auto=format`, alt: artwork.image.alt}],
    },
  }
}

export default async function ArtworkPage({params}: PageProps<'/collections/[slug]/[artwork]'>) {
  const result = await getArtwork(params)
  if (!result) notFound()
  const {collection, artwork, index, previous, next} = result
  const collectionHref = `/collections/${collection.slug}`

  return (
    <PageFade>
      <main className={styles.main}>
        <div className={styles.topbar}>
          <Link href={collectionHref} className={styles.back}>
            ← {collection.name}
          </Link>
          <p className={styles.counter}>
            {padIndex(index + 1)} / {padIndex(collection.artworks.length)}
          </p>
        </div>

        <ArtworkViewer
          aspectRatio={artwork.width / artwork.height}
          previous={previous && {href: previous.href, title: previous.title}}
          next={next && {href: next.href, title: next.title}}
          collectionHref={collectionHref}
        >
          <FramedArtwork
            image={artwork.image}
            width={artwork.width}
            height={artwork.height}
            heightRatio={1}
            sizes="(max-width: 768px) 80vw, 60vw"
            preload
          />
        </ArtworkViewer>

        <div className={styles.caption}>
          <h1 className={styles.title}>{artwork.title}</h1>
          {/* Seulement le titre et les dimensions : ni description ni prix (choix de mathis). */}
          <p className={styles.meta}>{formatDimensions(artwork.width, artwork.height)}</p>
        </div>
      </main>
    </PageFade>
  )
}
