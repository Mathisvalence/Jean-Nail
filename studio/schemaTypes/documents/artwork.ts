import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const ARTWORK_STATUSES = [
  {title: 'Disponible', value: 'available'},
  {title: 'Vendue', value: 'sold'},
] as const

export const artwork = defineType({
  name: 'artwork',
  title: 'Œuvre',
  type: 'document',
  icon: ImageIcon,
  groups: [
    {name: 'main', title: 'Œuvre', default: true},
    {name: 'details', title: 'Détails'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      type: 'slug',
      group: 'main',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'collection',
      type: 'reference',
      group: 'main',
      to: [{type: 'collection'}],
      options: {disableNew: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      description:
        'Photo originale, bien recadrée sur la toile (environ 2 500 px sur le grand côté).',
      type: 'image',
      group: 'main',
      options: {hotspot: true, metadata: ['lqip', 'palette']},
      fields: [
        defineField({
          name: 'alt',
          title: 'Description de l’image',
          description:
            'Lue par les lecteurs d’écran et les moteurs de recherche. Ex. : « Visage de femme en noir et blanc ».',
          type: 'string',
          validation: (rule) => rule.warning().required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'width',
      title: 'Largeur (cm)',
      type: 'number',
      group: 'main',
      validation: (rule) => rule.required().positive().max(1000),
    }),
    defineField({
      name: 'height',
      title: 'Hauteur (cm)',
      type: 'number',
      group: 'main',
      validation: (rule) => rule.required().positive().max(1000),
    }),
    defineField({
      name: 'price',
      title: 'Prix (€)',
      description: 'Laisser vide si le prix n’est pas communiqué.',
      type: 'number',
      group: 'main',
      validation: (rule) => rule.positive().integer(),
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      group: 'main',
      options: {list: [...ARTWORK_STATUSES], layout: 'radio', direction: 'horizontal'},
      initialValue: 'available',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      group: 'main',
      rows: 3,
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'order',
      title: 'Ordre dans la collection',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'medium',
      title: 'Technique',
      description: 'Ex. : huile sur toile, acrylique sur papier.',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'inventoryNumber',
      title: 'Numéro d’inventaire',
      description: 'Numéro de la photo d’origine (Jean NAIL-45.jpg → 45). Sert de repère interne.',
      type: 'string',
      group: 'details',
      readOnly: true,
    }),
  ],
  orderings: [
    {title: 'Ordre dans la collection', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {
      title: 'title',
      collection: 'collection.name',
      width: 'width',
      height: 'height',
      status: 'status',
      media: 'image',
    },
    prepare: ({title, collection, width, height, status, media}) => ({
      title,
      subtitle: [
        collection,
        width && height ? `${width} × ${height} cm` : null,
        status === 'sold' ? 'Vendue' : null,
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
