module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  roots: ['<rootDir>/src'],
}
