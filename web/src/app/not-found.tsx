import Link from 'next/link'

import {PageFade} from '@/components/PageFade'

import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <PageFade>
      <main className={styles.main}>
        <h1 className={styles.title}>Page introuvable</h1>
        <p className={styles.text}>Cette page n’existe pas, ou l’œuvre a été retirée.</p>
        <Link href="/" className={styles.back}>
          ← Collections
        </Link>
      </main>
    </PageFade>
  )
}
