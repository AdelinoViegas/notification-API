/** @type {import('jest').Config} */

export default {
  verbose: true,
  moduleNameMapper: {
    '^@/*/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: [
    "<rootDir>/src/components/", // ignora toda a pasta onde ficam os TSX
  ],
  transform: {
    '^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './_babel.config.js' }], // Usando o Babel com a configuração personalizada
  }
};