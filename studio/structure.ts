import {DocumentsIcon} from '@sanity/icons/Documents'
import {ImageIcon} from '@sanity/icons/Image'
import {UserIcon} from '@sanity/icons/User'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.documentTypeListItem('collection')
        .title('Collections')
        .icon(DocumentsIcon)
        .child(
          S.documentTypeList('collection')
            .title('Collections')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
      S.listItem()
        .title('Œuvres par collection')
        .icon(ImageIcon)
        .child(
          S.documentTypeList('collection')
            .title('Choisir une collection')
            .defaultOrdering([{field: 'order', direction: 'asc'}])
            .child((collectionId) =>
              S.documentList()
                .title('Œuvres')
                .schemaType('artwork')
                .filter('_type == "artwork" && collection._ref == $collectionId')
                .params({collectionId})
                .defaultOrdering([{field: 'order', direction: 'asc'}])
                .initialValueTemplates([
                  S.initialValueTemplateItem('artwork-in-collection', {collectionId}),
                ]),
            ),
        ),
      S.documentTypeListItem('artwork').title('Toutes les œuvres').icon(ImageIcon),
      S.divider(),
      S.listItem()
        .title('À propos')
        .icon(UserIcon)
        .id('about')
        .child(S.document().schemaType('about').documentId('about').title('À propos')),
    ])
