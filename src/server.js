import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js';
import connectToMongo from './database.js';
import removalInactiveUsers from './Helpers/inactiveUsers.js';

dotenv.config();

const db = await connectToMongo();
const app = express();
const port = 5000;

setInterval(() => removalInactiveUsers(db), 15000);

app.use(cors())
  .use(express.json())
  .use(routes)
  .listen(port, () => {
    console.log(`🌀 started server in door: ${port}`);
  });

export default db;
