import {about} from './documents/about'
import {artwork} from './documents/artwork'
import {collection} from './documents/collection'

export const schemaTypes = [collection, artwork, about]

/** Types qui n'existent qu'en un seul exemplaire. */
export const singletonTypes = new Set(['about'])
