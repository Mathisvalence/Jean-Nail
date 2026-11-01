import {HomeCollections} from '@/components/HomeCollections'
import {getHomeCollections} from '@/sanity/collection'

import styles from './page.module.css'

export default async function HomePage() {
  const collections = await getHomeCollections()

  return (
    <main className={styles.main}>
      <h1 className="visually-hidden">Jean Nail, peintre</h1>
      <HomeCollections collections={collections} />
      <p className={styles.tagline}>Sept collections, de la couleur au noir et blanc.</p>
    </main>
  )
}
