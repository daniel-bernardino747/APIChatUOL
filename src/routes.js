import express from 'express';
import { returnParticipants, registerParticipant } from './Controllers/ParticipantsController.js';
import { returnMessages, sendMessage } from './Controllers/MessagesController.js';
import updateStatus from './Controllers/StatusController.js';

const routes = express.Router();

routes.get('/participants', returnParticipants);

routes.post('/participants', registerParticipant);

routes.get('/messages', returnMessages);

routes.post('/messages', sendMessage);

routes.post('/status', updateStatus);

export default routes;
