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

type WallHeightInput = {
  /** Taille de la scène en pixels. */
  stageWidth: number
  stageHeight: number
  /** Épaisseur totale du cadre sur un axe (2 × baguette + 2 × passe-partout), en pixels. */
  frame: number
  /** Rapport largeur / hauteur affichée de l'œuvre la plus large (ratio de hauteur compris). */
  widestFactor: number
  /** Part de la largeur de scène que l'œuvre la plus large peut occuper. */
  widthShare?: number
  /** Part de la hauteur de scène laissée libre autour de la plus haute œuvre. */
  verticalMargin?: number
}

/**
 * Hauteur en pixels donnée à la plus haute œuvre : elle remplit la scène, cadre et marge
 * compris, sans que l'œuvre la plus large ne dépasse la part de largeur autorisée.
 */
export function fitWallHeight({
  stageWidth,
  stageHeight,
  frame,
  widestFactor,
  widthShare = 0.8,
  verticalMargin = 0.08,
}: WallHeightInput): number {
  const byHeight = stageHeight - frame - stageHeight * verticalMargin
  const byWidth = widestFactor > 0 ? (stageWidth * widthShare - frame) / widestFactor : byHeight
  return Math.round(Math.max(120, Math.min(byHeight, byWidth)))
}
