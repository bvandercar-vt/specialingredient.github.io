import js from '@eslint/js'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
  ignores: ['dist'],
  extends: [js.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    react,
  },
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
})
