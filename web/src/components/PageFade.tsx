import {ViewTransition, type ReactNode} from 'react'

/**
 * Fondu entre deux pages. Chaque navigation du routeur est une transition React :
 * l'ancienne page s'efface puis la nouvelle apparaît (voir `.page-fade` dans globals.css).
 * À placer dans chaque page, pas dans le layout qui ne se démonte jamais.
 */
export function PageFade({children}: {children: ReactNode}) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      {children}
    </ViewTransition>
  )
}
