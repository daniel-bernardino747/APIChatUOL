import { MongoClient } from 'mongodb';

async function connectToMongo() {
  try {
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    return (await mongoClient.connect()).db('UOLChat');
  } catch (err) {
    return err;
  }
}

export default connectToMongo;
