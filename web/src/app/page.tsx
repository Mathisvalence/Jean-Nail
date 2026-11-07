import {HomeCollections} from '@/components/HomeCollections'
import {PageFade} from '@/components/PageFade'
import {getHomeCollections} from '@/sanity/collection'

import styles from './page.module.css'

export default async function HomePage() {
  const collections = await getHomeCollections()

  return (
    <PageFade>
      <main className={styles.main}>
        <h1 className="visually-hidden">Jean Nail, peintre</h1>
        <HomeCollections collections={collections} />
      </main>
    </PageFade>
  )
}
