const Docker = require("dockerode");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");

const docker = new Docker();
const dynamoDBContainerName = "dynamodb-local-container";
const dynamoDBPort = 8000;

const waitForDynamoDB = async () => {
  let isConnected = false;
  const dynamoClient = new DynamoDB({
    region: "eu-west-1",
    endpoint: "http://localhost:8000",
  });

  while (!isConnected) {
    try {
      await dynamoClient.listTables({});
      isConnected = true;
    } catch (err) {
      console.log("Waiting for DynamoDB to become available...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

module.exports = async () => {
  console.log("Starting DynamoDB container...");
  const dynamoDBContainer = await docker.createContainer({
    Image: "amazon/dynamodb-local",
    name: dynamoDBContainerName,
    HostConfig: {
      PortBindings: {
        [`${dynamoDBPort}/tcp`]: [{ HostPort: `${dynamoDBPort}` }],
      },
    },
  });

  await dynamoDBContainer.start();

  await waitForDynamoDB();

  const dynamoClient = new DynamoDB({ endpoint: "http://localhost:8000" });

  const params = {
    TableName: "demo-table",
    AttributeDefinitions: [
      { AttributeName: "pk", AttributeType: "S" },
      { AttributeName: "sk", AttributeType: "S" },
      { AttributeName: "gsi1_pk", AttributeType: "S" },
      { AttributeName: "gsi1_sk", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "pk", KeyType: "HASH" },
      { AttributeName: "sk", KeyType: "RANGE" },
    ],
    BillingMode: "PAY_PER_REQUEST",
    GlobalSecondaryIndexes: [
      {
        IndexName: "gsi1",
        KeySchema: [
          { AttributeName: "gsi1_pk", KeyType: "HASH" },
          { AttributeName: "gsi1_sk", KeyType: "RANGE" },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
      },
    ],
  };

  try {
    console.log("Creating DynamoDB table 'demo-table'...");
    await dynamoClient.send(new CreateTableCommand(params));
    console.log("DynamoDB table 'demo-table' created.");
  } catch (err) {
    console.error("Error creating DynamoDB table:", err);
  }
};
