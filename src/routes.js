import express from 'express';
import { returnParticipants, registerParticipant } from './Controllers/ParticipantsController.js';
import { returnMessages, sendMessage } from './Controllers/MessagesController.js';

const routes = express.Router();

routes.get('/participants', returnParticipants);

routes.get('/messages', returnMessages);

routes.post('/participants', registerParticipant);

routes.post('/messages', sendMessage);

export default routes;
