const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-west-2",
  accessKeyId: "fakeMyKeyId",
  secretAccessKey: "fakeSecretAccessKey"
});

const dynamodb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000"
});

const params = {
  TableName: "Products",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" }
  ],
  BillingMode: "PAY_PER_REQUEST"
};

dynamodb.createTable(params, (err, data) => {
  if (err) console.error("Error:", err);
  else console.log("Table created:", data);
});