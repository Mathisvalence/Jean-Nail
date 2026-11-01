'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {type ReactNode, useEffect, useRef} from 'react'

import {swipeDirection} from '@/lib/navigation'
import {fitWallHeight} from '@/lib/scale'

import styles from './ArtworkViewer.module.css'

type Neighbour = {href: string; title: string}

type Props = {
  /** Rapport largeur / hauteur réel de l'œuvre. */
  aspectRatio: number
  previous: Neighbour | null
  next: Neighbour | null
  /** Page de la collection, ouverte avec la touche Échap. */
  collectionHref: string
  /** L'œuvre encadrée. */
  children: ReactNode
}

/**
 * Visionneuse d'une œuvre : flèches sur les côtés, touches ← → (Échap revient à la collection)
 * et glisser au doigt. Les changements d'œuvre remplacent l'entrée d'historique, pour que
 * « Retour » ramène à la collection plutôt qu'à l'œuvre précédente.
 */
export function ArtworkViewer({aspectRatio, previous, next, collectionHref, children}: Props) {
  const router = useRouter()
  const stageRef = useRef<HTMLDivElement>(null)

  // Navigation au clavier.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowLeft' && previous) router.replace(previous.href, {scroll: false})
      else if (event.key === 'ArrowRight' && next) router.replace(next.href, {scroll: false})
      else if (event.key === 'Escape') router.push(collectionHref)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router, previous, next, collectionHref])

  // Glisser au doigt.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let start: {x: number; y: number} | null = null

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      start = event.touches.length === 1 && touch ? {x: touch.clientX, y: touch.clientY} : null
    }
    const onTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0]
      if (!start || !touch) return
      const direction = swipeDirection(touch.clientX - start.x, touch.clientY - start.y)
      start = null
      const target = direction === 'next' ? next : direction === 'previous' ? previous : null
      if (target) router.replace(target.href, {scroll: false})
    }

    stage.addEventListener('touchstart', onTouchStart, {passive: true})
    stage.addEventListener('touchend', onTouchEnd, {passive: true})
    return () => {
      stage.removeEventListener('touchstart', onTouchStart)
      stage.removeEventListener('touchend', onTouchEnd)
    }
  }, [router, previous, next])

  // L'œuvre occupe toute la scène disponible, cadre compris.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(stage)
      const frame =
        2 * parseFloat(style.getPropertyValue('--frame-border')) +
        2 * parseFloat(style.getPropertyValue('--frame-mat'))
      const wallHeight = fitWallHeight({
        stageWidth: stage.clientWidth,
        stageHeight: stage.clientHeight,
        frame,
        widestFactor: aspectRatio,
        widthShare: 0.76,
      })
      stage.style.setProperty('--wall-height', `${wallHeight}px`)
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [aspectRatio])

  return (
    <div ref={stageRef} className={styles.stage}>
      <ArrowLink target={previous} direction="previous" />
      <div className={styles.artwork}>{children}</div>
      <ArrowLink target={next} direction="next" />
    </div>
  )
}

function ArrowLink({
  target,
  direction,
}: {
  target: Neighbour | null
  direction: 'previous' | 'next'
}) {
  const label = direction === 'previous' ? 'Œuvre précédente' : 'Œuvre suivante'
  const arrow = direction === 'previous' ? '←' : '→'
  // Aux extrémités, un espace vide garde l'œuvre centrée.
  if (!target) return <span className={styles.arrow} aria-hidden="true" />
  return (
    <Link
      href={target.href}
      replace
      scroll={false}
      className={styles.arrow}
      aria-label={`${label} : ${target.title}`}
    >
      {arrow}
    </Link>
  )
}
