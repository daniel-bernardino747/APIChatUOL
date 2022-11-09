import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js';
import connectToMongo from './database.js';

dotenv.config();

const db = await connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => console.log(`🌀 started server in door: ${port}`));

export default db;
