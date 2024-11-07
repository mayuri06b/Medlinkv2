// dbConfig.js

import { MongoClient } from "mongodb";

const uri = "your_mongodb_connection_string";
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.isConnected()) await client.connect();
  return client.db("yourDatabaseName");
}

export default { connectToDatabase };
