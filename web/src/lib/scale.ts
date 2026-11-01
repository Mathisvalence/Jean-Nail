export type Dimensions = {
  /** Largeur réelle en centimètres. */
  width: number
  /** Hauteur réelle en centimètres. */
  height: number
}

/**
 * Échelle commune (px par cm) d'une collection : toutes les œuvres partagent la même,
 * calculée pour que la plus haute tienne dans la hauteur disponible.
 * C'est ce qui donne des hauteurs différentes sur le mur, comme dans une vraie galerie.
 */
export function wallScale(artworks: readonly Dimensions[], availableHeightPx: number): number {
  if (availableHeightPx <= 0) {
    throw new RangeError('La hauteur disponible doit être positive.')
  }
  const tallest = Math.max(0, ...artworks.map(({height}) => height))
  if (tallest <= 0) {
    return 0
  }
  return availableHeightPx / tallest
}

/** Taille affichée (en px, arrondie) d'une œuvre à une échelle donnée, cadre non compris. */
export function displaySize({width, height}: Dimensions, scale: number): Dimensions {
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}
