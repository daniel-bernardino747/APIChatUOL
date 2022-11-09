import { MongoClient } from 'mongodb';

async function connectToMongo() {
  const mongoClient = new MongoClient(process.env.MONGO_URI);

  try {
    console.log('🌀 connected in MongoDB');
    return (await mongoClient.connect()).db('UOLChat');
  } catch (err) {
    return console.log(err);
  }
}

export default connectToMongo;
