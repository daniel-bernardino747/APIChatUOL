import express from 'express';
import { returnParticipants, registerParticipant } from './Controllers/Participants.js';

const routes = express.Router();

routes.get('/participants', returnParticipants);

routes.post('/participants', registerParticipant);

export default routes;
