module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './infra/setupDynamoDB.js',
  globalTeardown: './infra/teardownDynamoDB.js',
  coveragePathIgnorePatterns: ['<rootDir>/src/client.ts', 'test/'],
  testPathIgnorePatterns: ['/node_modules/', '/tutorials/']
}
