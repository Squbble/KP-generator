export default [
  {
    files: ['**/*.js'],
    ignores: ['dist/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        html2pdf: 'readonly'
      }
    },
    rules: {}
  }
];
