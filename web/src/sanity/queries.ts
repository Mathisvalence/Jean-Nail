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

export const ABOUT_QUERY = defineQuery(`
  *[_type == "about" && _id == "about"][0]{
    biography,
    email,
    instagram,
    portrait{alt, asset->{_id, url, metadata{lqip, dimensions{width, height}}}}
  }
`)

export const CONTACT_QUERY = defineQuery(
  `*[_type == "about" && _id == "about"][0]{email, instagram}`,
)
