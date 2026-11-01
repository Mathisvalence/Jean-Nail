import type {Metadata} from 'next'

import {Lighting} from '@/components/Lighting'
import {SiteFooter} from '@/components/SiteFooter'
import {SiteHeader} from '@/components/SiteHeader'

import {fontVariables} from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Jean Nail, peintre',
    template: '%s · Jean Nail',
  },
  description: 'Sept collections, de la couleur au noir et blanc.',
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Lighting />
      </body>
    </html>
  )
}
