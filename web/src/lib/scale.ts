export type Dimensions = {
  /** Largeur réelle en centimètres. */
  width: number
  /** Hauteur réelle en centimètres. */
  height: number
}

/**
 * Hauteur de chaque œuvre rapportée à la plus haute de la collection (entre 0 et 1).
 *
 * Toutes les œuvres d'une collection partagent ainsi la même échelle : la plus haute occupe
 * toute la hauteur du mur, les autres sont plus petites en proportion de leurs vraies
 * dimensions, comme dans une galerie. Le CSS multiplie ce ratio par la hauteur disponible.
 */
export function heightRatios(artworks: readonly Dimensions[]): number[] {
  const tallest = Math.max(0, ...artworks.map(({height}) => height))
  if (tallest <= 0) return artworks.map(() => 0)
  return artworks.map(({height}) => Math.max(0, height) / tallest)
}
