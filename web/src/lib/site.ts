/**
 * Adresse publique du site. Netlify fournit URL (adresse principale) au build ;
 * en local, on retombe sur le serveur de développement.
 */
export const SITE_URL = process.env.URL ?? 'http://localhost:3000'

export const SITE_NAME = 'Jean Nail'
export const SITE_DESCRIPTION = 'Sept collections, de la couleur au noir et blanc.'
