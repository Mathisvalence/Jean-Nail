import {Archivo_Narrow, Geist, Geist_Mono, Instrument_Serif} from 'next/font/google'

/** Titres et noms de collection, en capitales. */
export const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

/** Phrase d'accueil et état survolé, en italique. */
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

/** Textes courants. */
export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

/** Petites informations (prix, dimensions, compteurs), en capitales. */
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const fontVariables = [archivoNarrow, instrumentSerif, geist, geistMono]
  .map((font) => font.variable)
  .join(' ')
