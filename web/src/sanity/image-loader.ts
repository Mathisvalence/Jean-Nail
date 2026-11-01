'use client'

import type {ImageLoaderProps} from 'next/image'

/**
 * Les images viennent du CDN de Sanity, qui les redimensionne et choisit le format
 * (WebP/AVIF) lui-même : Next.js n'a donc pas à les retraiter.
 */
export default function sanityImageLoader({src, width, quality}: ImageLoaderProps): string {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 80))
  url.searchParams.set('fit', 'max')
  url.searchParams.set('auto', 'format')
  return url.toString()
}
