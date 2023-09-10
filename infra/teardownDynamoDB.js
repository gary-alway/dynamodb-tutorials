const Docker = require('dockerode')

const docker = new Docker()

async function stopDynamoDBContainer() {
  const container = docker.getContainer('dynamodb-local-container')
  await container.stop()
  await container.remove()
}

module.exports = stopDynamoDBContainer
