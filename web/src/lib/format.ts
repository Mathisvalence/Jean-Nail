const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

/** 4800 → « 4 800 € » (espaces insécables, comme le veut la typographie française). */
export function formatPrice(price: number): string {
  return priceFormatter.format(price)
}

/** 50 × 65 cm */
export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height} cm`
}

/** 2 → « 02 » : compteurs à deux chiffres, comme dans les maquettes. */
export function padIndex(value: number): string {
  return String(value).padStart(2, '0')
}

type ArtworkSaleInfo = {
  width: number
  height: number
  price?: number | null
  status?: string | null
}

/**
 * Ligne d'informations d'une œuvre : « 50 × 65 cm — 1 800 € ».
 * Une œuvre vendue n'affiche que ses dimensions : ni prix, ni mention « Vendue » (choix de mathis).
 */
export function formatArtworkMeta({width, height, price, status}: ArtworkSaleInfo): string {
  const dimensions = formatDimensions(width, height)
  if (status === 'sold') return dimensions
  if (price) return `${dimensions} — ${formatPrice(price)}`
  return dimensions
}
