module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './infra/setupDynamoDB.js',
  globalTeardown: './infra/teardownDynamoDB.js',
  coveragePathIgnorePatterns: ['<rootDir>/src/clients/', 'test/'],
  testPathIgnorePatterns: ['/node_modules/', '/tutorials/']
}
