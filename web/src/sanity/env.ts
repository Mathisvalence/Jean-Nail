function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined || value === '') {
    throw new Error(message)
  }
  return value
}

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Variable manquante : NEXT_PUBLIC_SANITY_PROJECT_ID (voir web/.env.example).',
)

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Variable manquante : NEXT_PUBLIC_SANITY_DATASET (voir web/.env.example).',
)

/** Date figée volontairement : on ne la change que pour adopter une nouvelle version de l'API. */
export const apiVersion = '2026-11-01'
