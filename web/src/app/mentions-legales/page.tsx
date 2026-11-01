import type {Metadata} from 'next'

import {PageFade} from '@/components/PageFade'
import {sanityFetch} from '@/sanity/fetch'
import {CONTACT_QUERY} from '@/sanity/queries'

import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Mentions légales',
  robots: {index: false},
}

/*
 * Mentions obligatoires (loi pour la confiance dans l'économie numérique, art. 6).
 * Les champs « à compléter » doivent être remplis avant la mise en ligne.
 */
export default async function LegalNoticePage() {
  const contact = await sanityFetch(CONTACT_QUERY)

  return (
    <PageFade>
      <main className={styles.main}>
        <h1 className={styles.title}>Mentions légales</h1>

        <section className={styles.section}>
          <h2>Éditeur du site</h2>
          <p>
            Jean Nail, artiste peintre.
            <br />
            Adresse : à compléter.
            <br />
            {contact?.email ? (
              <>
                Contact : <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </>
            ) : (
              'Contact : à compléter.'
            )}
          </p>
          <p>Directeur de la publication : Jean Nail.</p>
        </section>

        <section className={styles.section}>
          <h2>Hébergement</h2>
          <p>
            Netlify, Inc., San Francisco, Californie, États-Unis —{' '}
            <a href="https://www.netlify.com" target="_blank" rel="noreferrer">
              netlify.com
            </a>
            .
            <br />
            Contenus et images : Sanity AS, Oslo, Norvège —{' '}
            <a href="https://www.sanity.io" target="_blank" rel="noreferrer">
              sanity.io
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2>Propriété intellectuelle</h2>
          <p>
            Les œuvres et leurs photographies sont la propriété de Jean Nail. Toute reproduction,
            même partielle, est interdite sans son autorisation écrite.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Données personnelles</h2>
          <p>
            Ce site ne dépose aucun cookie et ne collecte aucune donnée personnelle. Les messages
            envoyés par e-mail ne servent qu’à y répondre.
          </p>
        </section>
      </main>
    </PageFade>
  )
}
