/** 50 × 65 cm */
export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height} cm`
}

/** 2 → « 02 » : compteurs à deux chiffres, comme dans les maquettes. */
export function padIndex(value: number): string {
  return String(value).padStart(2, '0')
}
