import Image from 'next/image'
import type {CSSProperties} from 'react'

import styles from './FramedArtwork.module.css'

export type FramedArtworkImage = {
  url: string
  alt: string
  lqip?: string | null
}

type Props = {
  image: FramedArtworkImage
  /** Dimensions réelles (cm) : elles donnent les proportions du tableau. */
  width: number
  height: number
  /** Hauteur rapportée à la plus haute œuvre affichée (voir lib/scale.ts). */
  heightRatio: number
  /** Taille affichée approximative, pour que le navigateur choisisse la bonne image. */
  sizes: string
  /** Charger l'image en avance (œuvres visibles dès l'arrivée sur la page). */
  preload?: boolean
}

/** Œuvre encadrée : baguette noire, passe-partout blanc, ombres (composant Figma « Œuvre encadrée »). */
export function FramedArtwork({image, width, height, heightRatio, sizes, preload}: Props) {
  const style = {
    '--artwork-ratio': `${width} / ${height}`,
    '--artwork-height-ratio': heightRatio,
  } as CSSProperties

  return (
    <div className={styles.frame} style={style}>
      <div className={styles.canvas}>
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          placeholder={image.lqip ? 'blur' : 'empty'}
          blurDataURL={image.lqip ?? undefined}
          className={styles.image}
        />
      </div>
    </div>
  )
}
