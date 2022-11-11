import dayjs from 'dayjs';
import schemaParticipant from '../Middlewares/participantsMiddleware.js';
import { collectionParticipants, collectionMessages } from '../Utils/collections.js';

function returnParticipants(request, response) {
  collectionParticipants()
    .find()
    .toArray()
    .then((allParticipants) => response.status(200).send(allParticipants));
}

async function registerParticipant(request, response) {
  const { name } = request.body;
  const existingUser = await collectionParticipants().findOne({ name });

  if (existingUser) {
    return response.status(409).json({ error: 'This username already exists.' });
  }

  const newParticipant = {
    name,
    lastStatus: Date.now(),
  };

  const messageSendingTime = dayjs().format('HH:mm:ss');

  const statusMessage = {
    from: name,
    to: 'Todos',
    text: 'entra na sala...',
    type: 'status',
    time: messageSendingTime,
  };

  try {
    const { error, value: participant } = schemaParticipant.validate(newParticipant);
    if (error) throw error;

    await collectionParticipants().insertOne(participant);
    await collectionMessages().insertOne(statusMessage);

    return response.sendStatus(201);
  } catch (err) {
    const messageError = err.details[0].message;

    return response.status(422).json({ error: messageError });
  }
}

export { returnParticipants, registerParticipant };
