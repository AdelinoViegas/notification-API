/** @type {import('jest').Config} */

export default {
  verbose: true,
  moduleNameMapper: {
    // Corrigido: Removido o '*' extra para bater corretamente com @/backend/...
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: [
    "<rootDir>/src/components/",
  ],
  // A CHAVE DO PROBLEMA:
  // Força o Jest a processar a biblioteca 'jose' mesmo estando em node_modules
  transformIgnorePatterns: [
    '/node_modules/(?!(jose)/)'
  ],
  transform: {
    '^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './_babel.config.js' }],
  },
  // Opcional: Se der erro de "TextEncoder is not defined" (comum com a lib jose)
  testEnvironment: 'node', 
};