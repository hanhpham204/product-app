const db = require('../config/dynamo');

const TABLE = "Products";

exports.getAll = async () => {
  const data = await db.scan({ TableName: TABLE }).promise();
  return data.Items;
};

exports.getById = async (id) => {
  const data = await db.get({
    TableName: TABLE,
    Key: { id }
  }).promise();
  return data.Item;
}; 

exports.search = async (keyword) => {
  const params = {
    TableName: TABLE,
    FilterExpression: "contains(#name, :keyword)",
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":keyword": keyword
    }
  };

  const data = await db.scan(params).promise();
  return data.Items;
};

exports.create = async (product) => {
  await db.put({
    TableName: TABLE,
    Item: product
  }).promise();
};

exports.update = async (product) => {
  await db.put({
    TableName: TABLE,
    Item: product
  }).promise();
};

exports.delete = async (id) => {
  await db.delete({
    TableName: TABLE,
    Key: { id }
  }).promise();
};