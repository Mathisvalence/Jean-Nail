import {sanityFetch} from '@/sanity/fetch'
import {CONTACT_QUERY} from '@/sanity/queries'

import styles from './SiteFooter.module.css'

export async function SiteFooter() {
  const contact = await sanityFetch(CONTACT_QUERY)

  return (
    <footer className={styles.footer}>
      <span>© 2026 Jean Nail</span>
      {contact?.instagram && (
        <a href={contact.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      )}
      {contact?.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
    </footer>
  )
}
