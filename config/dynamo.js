const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000"
});

module.exports = dynamoDB;