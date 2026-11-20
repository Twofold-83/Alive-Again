// `npm run lint`: catches names that do not exist and code that is no longer used.
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'data/', 'public/px/', 'public/packs/', 'tools/make-sprites.js'] },
  { files: ['public/**/*.js'], languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.browser } } },
  { files: ['server/**/*.js', '**/*.mjs'], languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.node } } },
  { files: ['server.js', 'test/**/*.js', 'tools/**/*.js'], languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser } } },
  {
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
      'no-dupe-keys': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'warn',
      'no-self-assign': 'warn',
    },
  },
];
