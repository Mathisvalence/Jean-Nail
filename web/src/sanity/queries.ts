import {defineQuery} from 'next-sanity'

const ARTWORK_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  width,
  height,
  price,
  status,
  description,
  image{
    alt,
    asset->{_id, url, metadata{lqip, dimensions{width, height}}}
  }
`

export const COLLECTION_SLUGS_QUERY = defineQuery(
  `*[_type == "collection" && defined(slug.current)]{"slug": slug.current}`,
)

export const COLLECTION_QUERY = defineQuery(`
  *[_type == "collection" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    "artworks": *[_type == "artwork" && collection._ref == ^._id && defined(image.asset)]
      | order(order asc, inventoryNumber asc){${ARTWORK_FIELDS}}
  }
`)

export const ARTWORK_PATHS_QUERY = defineQuery(`
  *[_type == "artwork" && defined(slug.current) && defined(collection->slug.current)]{
    "slug": slug.current,
    "collection": collection->slug.current
  }
`)

/**
 * Accueil : les collections dans l'ordre du Studio, leur nombre d'œuvres et l'accrochage
 * (les œuvres mises en avant, sinon les trois premières de la collection).
 */
export const HOME_QUERY = defineQuery(`
  *[_type == "collection" && defined(slug.current)] | order(order asc, name asc){
    _id,
    name,
    "slug": slug.current,
    "count": count(*[_type == "artwork" && collection._ref == ^._id && defined(image.asset)]),
    // Une référence peut viser une œuvre supprimée ou non publiée : null, écarté côté code.
    "featured": coalesce(featuredArtworks[]->{${ARTWORK_FIELDS}}, []),
    "firstArtworks": *[_type == "artwork" && collection._ref == ^._id && defined(image.asset)]
      | order(order asc, inventoryNumber asc)[0...3]{${ARTWORK_FIELDS}}
  }
`)

export const CONTACT_QUERY = defineQuery(
  `*[_type == "about" && _id == "about"][0]{email, instagram}`,
)
