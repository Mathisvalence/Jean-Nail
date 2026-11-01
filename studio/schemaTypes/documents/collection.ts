import {DocumentsIcon} from '@sanity/icons/Documents'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      description: 'Générée à partir du nom. Elle apparaît dans l’adresse du site : /collections/…',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      description: 'Position dans la liste de l’accueil (1 = en premier).',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'featuredArtworks',
      title: 'Œuvres mises en avant',
      description:
        'Trois œuvres de cette collection, affichées sur l’accueil au survol du nom. La première est la grande.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'artwork'}],
          options: {
            disableNew: true,
            filter: ({document}) => ({
              filter: 'collection._ref == $id',
              params: {id: document._id.replace(/^drafts\./, '')},
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(3).unique(),
    }),
  ],
  orderings: [
    {title: 'Ordre d’affichage', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', order: 'order', media: 'featuredArtworks.0.image'},
    prepare: ({title, order, media}) => ({
      title,
      subtitle: order ? `Position ${order}` : undefined,
      media,
    }),
  },
})
