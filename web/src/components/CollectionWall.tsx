'use client'

import Link from 'next/link'
import {useCallback, useEffect, useRef, useState} from 'react'

import {formatArtworkMeta, padIndex} from '@/lib/format'

import styles from './CollectionWall.module.css'
import {FramedArtwork, type FramedArtworkImage} from './FramedArtwork'

export type WallArtwork = {
  id: string
  href: string
  title: string
  width: number
  height: number
  heightRatio: number
  price: number | null
  status: string | null
  description: string | null
  image: FramedArtworkImage
}

type Props = {
  artworks: WallArtwork[]
}

/**
 * Mur d'une collection : les œuvres défilent de gauche à droite (molette, trackpad, glisser),
 * à leur échelle réelle. L'œuvre au centre affiche ses informations en bas à gauche.
 */
export function CollectionWall({artworks}: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActive = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const center = scroller.scrollLeft + scroller.clientWidth / 2
    let closest = 0
    let closestDistance = Infinity
    Array.from(scroller.children).forEach((child, index) => {
      const item = child as HTMLElement
      const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center)
      if (distance < closestDistance) {
        closest = index
        closestDistance = distance
      }
    })
    setActiveIndex(closest)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActive)
    }

    // La molette verticale fait défiler le mur horizontalement (le trackpad gère déjà les deux axes).
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      scroller.scrollLeft += event.deltaY
    }

    // Au chargement, la première œuvre est centrée.
    const first = scroller.firstElementChild as HTMLElement | null
    if (first) {
      scroller.scrollLeft = first.offsetLeft + first.offsetWidth / 2 - scroller.clientWidth / 2
    }

    scroller.addEventListener('scroll', onScroll, {passive: true})
    scroller.addEventListener('wheel', onWheel, {passive: false})
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      scroller.removeEventListener('scroll', onScroll)
      scroller.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onScroll)
    }
  }, [updateActive])

  // La plus haute œuvre, cadre compris, occupe la hauteur de la scène moins une marge.
  useEffect(() => {
    const stage = stageRef.current
    const scroller = scrollerRef.current
    if (!stage || !scroller) return

    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(scroller)
      const frame =
        2 * parseFloat(style.getPropertyValue('--frame-border')) +
        2 * parseFloat(style.getPropertyValue('--frame-mat'))
      const margin = stage.clientHeight * 0.08
      // Sur écran étroit, l'œuvre la plus large doit aussi tenir dans 80 % de la largeur.
      const widestFactor = Math.max(
        ...artworks.map(({heightRatio, width, height}) => (heightRatio * width) / height),
      )
      const maxByWidth = (stage.clientWidth * 0.8 - frame) / widestFactor
      const wallHeight = Math.max(120, Math.min(stage.clientHeight - frame - margin, maxByWidth))
      scroller.style.setProperty('--wall-height', `${Math.round(wallHeight)}px`)
      updateActive()
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [artworks, updateActive])

  const active = artworks[activeIndex]

  return (
    <div className={styles.wall}>
      <div ref={stageRef} className={styles.stage}>
        <ul
          ref={scrollerRef}
          className={styles.scroller}
          tabIndex={0}
          aria-label="Œuvres de la collection"
        >
          {artworks.map((artwork, index) => (
            <li key={artwork.id} className={styles.item}>
              <Link
                href={artwork.href}
                className={styles.link}
                aria-label={`Voir ${artwork.title}`}
              >
                <FramedArtwork
                  image={artwork.image}
                  width={artwork.width}
                  height={artwork.height}
                  heightRatio={artwork.heightRatio}
                  sizes="(max-width: 768px) 70vw, 40vw"
                  priority={index < 3}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.footer}>
        {active && (
          <div className={styles.caption} aria-live="polite">
            <p className={styles.title}>{active.title}</p>
            <p className={styles.meta}>{formatArtworkMeta(active)}</p>
            {active.description && <p className={styles.description}>{active.description}</p>}
          </div>
        )}
        <p className={styles.counter}>
          <span className={styles.hint}>Faire défiler →</span>{' '}
          <span>
            {padIndex(activeIndex + 1)} / {padIndex(artworks.length)}
          </span>
        </p>
      </div>
    </div>
  )
}
