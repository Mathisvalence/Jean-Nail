import styles from './Lighting.module.css'

/** Éclairage de galerie : spot centré en haut, bords assombris, posé au-dessus de toute la page. */
export function Lighting() {
  return <div className={styles.lighting} aria-hidden="true" />
}
