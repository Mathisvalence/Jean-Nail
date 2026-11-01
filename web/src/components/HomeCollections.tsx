'use client'

import Link from 'next/link'
import {type CSSProperties, useState} from 'react'

import {padIndex} from '@/lib/format'
import type {HomeCollection} from '@/sanity/collection'

import {FramedArtwork} from './FramedArtwork'
import styles from './HomeCollections.module.css'

/*
 * Largeurs affichées, reprises des plafonds de HomeCollections.module.css
 * (30vw - 120px pour la grande œuvre, 14vw - 56px pour les petites).
 * Sous 1100px l'accrochage est masqué : on vise petit pour l'image préchargée.
 */
const LARGE_SIZES = '(max-width: 1100px) 20vw, calc(30vw - 120px)'
const SMALL_SIZES = '(max-width: 1100px) 10vw, calc(14vw - 56px)'

type Props = {
  collections: HomeCollection[]
}

/**
 * Liste des collections de l'accueil. Sur ordinateur, survoler (ou atteindre au clavier) un nom
 * affiche son accrochage à droite ; la première collection est affichée au chargement.
 * Sur mobile, seule la liste reste, centrée.
 */
export function HomeCollections({collections}: Props) {
  const [activeId, setActiveId] = useState(collections[0]?.id)

  return (
    <div className={styles.layout}>
      <nav className={styles.list} aria-labelledby="collections-label">
        <p id="collections-label" className={styles.label}>
          Choisissez une collection
        </p>
        <ul>
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link
                href={collection.href}
                className={styles.link}
                data-active={collection.id === activeId || undefined}
                onPointerEnter={() => setActiveId(collection.id)}
                onFocus={() => setActiveId(collection.id)}
              >
                <span className={styles.name}>{collection.name}</span>
                <span className={styles.count}>{padIndex(collection.count)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.hangs} aria-hidden="true">
        {collections.map((collection, index) => (
          <div
            key={collection.id}
            className={styles.hang}
            data-active={collection.id === activeId || undefined}
          >
            {collection.hang.map((artwork, position) => (
              <div
                key={artwork.id}
                className={position === 0 ? styles.large : styles.small}
                style={{'--aspect': artwork.width / artwork.height} as CSSProperties}
              >
                <FramedArtwork
                  image={artwork.image}
                  width={artwork.width}
                  height={artwork.height}
                  heightRatio={1}
                  sizes={position === 0 ? LARGE_SIZES : SMALL_SIZES}
                  preload={index === 0}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
