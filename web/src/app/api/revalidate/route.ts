import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

import {SANITY_CACHE_TAG} from '@/sanity/fetch'

type WebhookPayload = {_type?: string}

/**
 * Appelée par un webhook Sanity à chaque publication, modification ou suppression.
 * Le site est petit : on marque tout le contenu Sanity comme périmé, et chaque page se
 * régénère à sa prochaine visite (le visiteur reçoit l'ancienne version pendant ce temps).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({message: 'SANITY_REVALIDATE_SECRET manquant'}, {status: 500})
  }

  // Le troisième argument attend que le Content Lake ait propagé la modification.
  const {isValidSignature, body} = await parseBody<WebhookPayload>(request, secret, true)
  if (!isValidSignature) {
    return NextResponse.json({message: 'Signature invalide'}, {status: 401})
  }

  revalidateTag(SANITY_CACHE_TAG, 'max')
  return NextResponse.json({revalidated: true, type: body?._type ?? null})
}
