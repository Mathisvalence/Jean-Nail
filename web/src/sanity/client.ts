import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Contenu publié uniquement, servi par le CDN de Sanity.
  useCdn: true,
  perspective: 'published',
})
