import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'À propos',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'portrait',
      title: 'Photo de l’artiste',
      description: 'Facultative.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Description de l’image',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'biography',
      title: 'Présentation',
      description: 'Deux paragraphes environ.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [{title: 'Italique', value: 'em'}],
            annotations: [],
          },
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      validation: (rule) => rule.required().email().error('Saisir une adresse e-mail valide.'),
    }),
    defineField({
      name: 'instagram',
      title: 'Compte Instagram',
      description: 'Lien complet, ex. : https://www.instagram.com/jeannail',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
  ],
  preview: {
    prepare: () => ({title: 'À propos'}),
  },
})
