import express from 'express';

import updateStatus from './Controllers/StatusController.js';

import { returnParticipants, registerParticipant } from './Controllers/ParticipantsController.js';
import { returnMessages, sendMessage } from './Controllers/MessagesController.js';

const routes = express.Router();

routes.post('/participants', registerParticipant);

routes.get('/participants', returnParticipants);

routes.post('/messages', sendMessage);

routes.get('/messages', returnMessages);

routes.post('/status', updateStatus);

export default routes;
