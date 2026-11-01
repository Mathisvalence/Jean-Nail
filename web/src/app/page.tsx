import styles from './page.module.css'

/**
 * Page d'accueil provisoire : elle sera remplacée à l'étape 3 (pages du site).
 */
export default function HomePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Jean Nail</h1>
      <p className={styles.tagline}>Sept collections, de la couleur au noir et blanc.</p>
    </main>
  )
}
