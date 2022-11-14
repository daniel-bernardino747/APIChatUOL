import express from 'express';

import updateStatus from './Controllers/StatusController.js';

import { returnParticipants, registerParticipant } from './Controllers/ParticipantsController.js';
import {
  changeMessage, deleteMessage, returnMessages, sendMessage,
} from './Controllers/MessagesController.js';

const routes = express.Router();

routes.post('/participants', registerParticipant);

routes.get('/participants', returnParticipants);

routes.post('/messages', sendMessage);

routes.get('/messages', returnMessages);

routes.delete('/messages/:id', deleteMessage);

routes.put('/messages/:id', changeMessage);

routes.post('/status', updateStatus);

export default routes;
