/**
 * Import des œuvres de Jean Nail dans Sanity, depuis le dossier de photos et le CSV.
 *
 * Utilisation (depuis le dossier studio/, après « npx sanity login ») :
 *   PHOTOS_DIR="/chemin/vers/photo oeuvres" npm run import:artworks
 *
 * Options (variables d'environnement) :
 *   DRY_RUN=1  affiche ce qui serait importé, sans rien envoyer à Sanity
 *   FORCE=1    remplace les documents existants (sinon ils sont laissés intacts)
 *
 * Le script peut être relancé sans risque : les identifiants sont stables (artwork-45,
 * collection-insolite…) et Sanity ne stocke qu'une fois une même image.
 */
import {createReadStream} from 'node:fs'
import {readdir, readFile} from 'node:fs/promises'
import path from 'node:path'

import {getCliClient} from 'sanity/cli'

import {
  buildArtwork,
  collectionId,
  COLLECTIONS,
  compareInventoryNumbers,
  inventoryNumberFromFilename,
  artworkId,
  type CsvRow,
} from './artworks'
import {parseCsv} from './csv'

const photosDir = process.env.PHOTOS_DIR
const dryRun = process.env.DRY_RUN === '1'
const force = process.env.FORCE === '1'

if (!photosDir) {
  console.error('Indiquer le dossier des photos : PHOTOS_DIR="/chemin/vers/photo oeuvres"')
  process.exit(1)
}

const client = getCliClient({apiVersion: '2026-11-01'})

/** macOS stocke les accents en forme décomposée : on compare toujours en NFC. */
const nfc = (value: string) => value.normalize('NFC')

async function findEntry(dir: string, wanted: string): Promise<string | undefined> {
  const entries = await readdir(dir)
  return entries.find((entry) => nfc(entry) === nfc(wanted))
}

async function readCsvRows(dir: string): Promise<Map<string, CsvRow>> {
  const csvFile = (await readdir(dir)).find((entry) => entry.toLowerCase().endsWith('.csv'))
  if (!csvFile) throw new Error(`Aucun fichier CSV trouvé dans « ${dir} ».`)
  const rows = parseCsv(await readFile(path.join(dir, csvFile), 'utf8'))
  return new Map(rows.map((row) => [nfc(row['Photo'] ?? ''), row]))
}

async function exists(id: string): Promise<boolean> {
  return (await client.fetch<number>('count(*[_id == $id])', {id})) > 0
}

async function main() {
  const dir = photosDir as string
  const csvRows = await readCsvRows(dir)
  const placeholderReport: {id: string; fields: string[]}[] = []
  let created = 0
  let skipped = 0

  console.log(`${dryRun ? '[essai] ' : ''}Import depuis « ${dir} »`)

  for (const collection of COLLECTIONS) {
    const folder = await findEntry(dir, collection.folder)
    if (!folder) {
      console.warn(`⚠ Dossier introuvable pour « ${collection.name} » : « ${collection.folder} »`)
      continue
    }

    const photos = (await readdir(path.join(dir, folder)))
      .filter((file) => /\.jpe?g$/i.test(file))
      .sort((a, b) =>
        compareInventoryNumbers(inventoryNumberFromFilename(a), inventoryNumberFromFilename(b)),
      )

    console.log(`\n${collection.name} : ${photos.length} photos`)

    const collectionDoc = {
      _id: collectionId(collection.slug),
      _type: 'collection' as const,
      name: collection.name,
      slug: {_type: 'slug' as const, current: collection.slug},
      order: collection.order,
    }
    if (!dryRun) {
      await (force
        ? client.createOrReplace(collectionDoc)
        : client.createIfNotExists(collectionDoc))
    }

    for (const [index, file] of photos.entries()) {
      const inventoryNumber = inventoryNumberFromFilename(file)
      const id = artworkId(inventoryNumber)

      if (!dryRun && !force && (await exists(id))) {
        skipped++
        console.log(`  = ${id} existe déjà, laissé intact`)
        continue
      }

      const row = csvRows.get(nfc(file))
      if (!row) console.warn(`  ⚠ ${file} absent du CSV`)

      let imagePixels: {width: number; height: number} | undefined
      let assetId = 'image-essai'
      if (!dryRun) {
        const asset = await client.assets.upload(
          'image',
          createReadStream(path.join(dir, folder, file)),
          {filename: nfc(file)},
        )
        assetId = asset._id
        imagePixels = asset.metadata?.dimensions
      }

      const {artwork, placeholders} = buildArtwork({
        inventoryNumber,
        row,
        collection,
        order: index + 1,
        imagePixels,
      })
      placeholderReport.push({id, fields: placeholders})

      const document = {
        ...artwork,
        image: {
          _type: 'image',
          asset: {_type: 'reference', _ref: assetId},
          alt: `${artwork.title}, collection ${collection.name}`,
        },
      }

      if (!dryRun) await client.createOrReplace(document)
      created++
      console.log(
        `  + ${id} · ${artwork.width} × ${artwork.height} cm${
          placeholders.includes('dimensions') ? ' (estimées)' : ''
        }`,
      )
    }

    const featured = collection.featured.map((number) => ({
      _key: number,
      _type: 'reference',
      _ref: artworkId(number),
    }))
    if (!dryRun) {
      await client
        .patch(collectionId(collection.slug))
        .setIfMissing({featuredArtworks: featured})
        .commit()
    }
  }

  const estimated = placeholderReport.filter(({fields}) => fields.includes('dimensions'))
  console.log(
    `\n${created} œuvres ${dryRun ? 'à importer' : 'importées'}, ${skipped} déjà présentes.`,
  )
  console.log('Contenu fictif à remplacer avant la mise en ligne : titres, prix, descriptions.')
  if (estimated.length > 0) {
    console.log(`Dimensions estimées (absentes du CSV) : ${estimated.map(({id}) => id).join(', ')}`)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
