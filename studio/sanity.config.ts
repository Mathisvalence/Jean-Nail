import {frFRLocale} from '@sanity/locale-fr-fr'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes, singletonTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Jean Nail',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'sjigsrm6',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [structureTool({structure}), visionTool(), frFRLocale()],

  schema: {
    types: schemaTypes,
    // Les documents uniques (ex. « À propos ») ne peuvent pas être créés depuis le bouton « + ».
    templates: (templates) => [
      ...templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
      {
        id: 'artwork-in-collection',
        title: 'Œuvre dans cette collection',
        schemaType: 'artwork',
        parameters: [{name: 'collectionId', type: 'string'}],
        value: ({collectionId}: {collectionId: string}) => ({
          collection: {_type: 'reference', _ref: collectionId},
        }),
      },
    ],
  },

  document: {
    // Empêche la duplication ou la suppression d'un document unique.
    actions: (actions, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? actions.filter(
            ({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : actions,
  },
})
