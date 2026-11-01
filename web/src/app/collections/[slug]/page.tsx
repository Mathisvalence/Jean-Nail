import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {CollectionWall} from '@/components/CollectionWall'
import {padIndex} from '@/lib/format'
import {getCollection} from '@/sanity/collection'
import {sanityFetch} from '@/sanity/fetch'
import {COLLECTION_SLUGS_QUERY} from '@/sanity/queries'

import styles from './page.module.css'

export async function generateStaticParams() {
  const collections = await sanityFetch(COLLECTION_SLUGS_QUERY)
  return collections.flatMap(({slug}) => (slug ? [{slug}] : []))
}

export async function generateMetadata({
  params,
}: PageProps<'/collections/[slug]'>): Promise<Metadata> {
  const {slug} = await params
  const collection = await getCollection(slug)
  return collection ? {title: collection.name} : {}
}

export default async function CollectionPage({params}: PageProps<'/collections/[slug]'>) {
  const {slug} = await params
  const collection = await getCollection(slug)
  if (!collection) notFound()

  return (
    <main className={styles.main}>
      <div className={styles.heading}>
        <h1 className={styles.title}>
          {collection.name}
          <span className={styles.count}>{padIndex(collection.artworks.length)} œuvres</span>
        </h1>
        <Link href="/" className={styles.back}>
          ← Collections
        </Link>
      </div>
      <CollectionWall artworks={collection.artworks} />
    </main>
  )
}
