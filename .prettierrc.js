/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  overrides: [
    {
      files: '*.json',
      options: {
        insertFinalNewLine: 'false',
      },
    },
  ],
}

export default config
