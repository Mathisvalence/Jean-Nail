import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'sjigsrm6',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  studioHost: 'jean-nail',
  deployment: {
    // Identifiant du Studio hébergé (jean-nail.sanity.studio), donné par le premier `sanity deploy`.
    appId: 'hod3kdc8fll01hfddwj1wyp0',
    autoUpdates: true,
  },
  typegen: {
    enabled: true,
    path: '../web/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
  },
})
