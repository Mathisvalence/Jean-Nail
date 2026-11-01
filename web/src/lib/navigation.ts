type Slugged = {slug: string}

export type Neighbours<T extends Slugged> = {
  /** Position de l'œuvre dans la collection, à partir de 0 (-1 si absente). */
  index: number
  previous: T | null
  next: T | null
}

/** Œuvres précédente et suivante dans l'ordre de la collection, sans boucler aux extrémités. */
export function neighbours<T extends Slugged>(items: readonly T[], slug: string): Neighbours<T> {
  const index = items.findIndex((item) => item.slug === slug)
  if (index === -1) return {index, previous: null, next: null}
  return {
    index,
    previous: items[index - 1] ?? null,
    next: items[index + 1] ?? null,
  }
}

/**
 * Sens d'un glissé au doigt : vers la gauche on avance (« next »), vers la droite on recule
 * (« previous »). Un geste trop court ou surtout vertical (défilement de la page) est ignoré.
 */
export function swipeDirection(
  deltaX: number,
  deltaY: number,
  threshold = 50,
): 'previous' | 'next' | null {
  if (Math.abs(deltaX) < threshold || Math.abs(deltaX) <= Math.abs(deltaY)) return null
  return deltaX < 0 ? 'next' : 'previous'
}
