export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Les messages sont rédigés en français : on n'impose pas la casse du sujet.
    'subject-case': [0],
  },
}
