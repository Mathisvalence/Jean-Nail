import type {Metadata} from 'next'
import {PortableText} from 'next-sanity'
import Image from 'next/image'

import {PageFade} from '@/components/PageFade'
import {sanityFetch} from '@/sanity/fetch'
import {ABOUT_QUERY} from '@/sanity/queries'

import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'À propos',
}

/** Instagram : « https://www.instagram.com/jeannail/ » → « @jeannail ». */
function instagramHandle(url: string): string {
  const handle = url.replace(/\/+$/, '').split('/').pop()
  return handle ? `@${handle}` : 'Instagram'
}

export default async function AboutPage() {
  const about = await sanityFetch(ABOUT_QUERY)
  const portrait = about?.portrait?.asset
  const dimensions = portrait?.metadata?.dimensions

  return (
    <PageFade>
      <main className={styles.main}>
        {portrait?.url && dimensions?.width && dimensions.height && (
          <div className={styles.portrait}>
            <Image
              src={portrait.url}
              alt={about?.portrait?.alt ?? 'Jean Nail'}
              width={dimensions.width}
              height={dimensions.height}
              sizes="(max-width: 768px) 60vw, 22rem"
              placeholder={portrait.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={portrait.metadata?.lqip ?? undefined}
              preload
            />
          </div>
        )}

        <div className={styles.text}>
          <h1 className={styles.title}>À propos</h1>
          {about?.biography && (
            <div className={styles.biography}>
              <PortableText value={about.biography} />
            </div>
          )}
          {(about?.email || about?.instagram) && (
            <ul className={styles.contact}>
              {about.email && (
                <li>
                  <a href={`mailto:${about.email}`}>{about.email}</a>
                </li>
              )}
              {about.instagram && (
                <li>
                  <a href={about.instagram} target="_blank" rel="noreferrer">
                    {instagramHandle(about.instagram)}
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </main>
    </PageFade>
  )
}
