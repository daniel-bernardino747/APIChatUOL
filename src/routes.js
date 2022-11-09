import express from 'express';
import { returnParticipants, registerParticipant } from './Controllers/Participants.js';
import sendMessage from './Controllers/MessagesController.js';

const routes = express.Router();

routes.get('/participants', returnParticipants);

routes.post('/participants', registerParticipant);

routes.post('/messages', sendMessage);

export default routes;
