import dayjs from 'dayjs';
import { NAME_IN_USE } from '../Constants/MessageErrors.js';
import schemaParticipant from '../Middlewares/participantsMiddleware.js';
import { collectionParticipants, collectionMessages } from '../Utils/collections.js';

async function returnParticipants(req, res) {
  try {
    const allParticipants = await collectionParticipants().find({}).toArray();
    res.status(200).send(allParticipants);
  } catch (err) {
    res.status(400).send({ error: err });
  }
}

async function registerParticipant(req, res) {
  const { name } = req.body;

  try {
    const existingUser = await collectionParticipants().findOne({ name });

    if (existingUser) return res.status(409).json({ error: NAME_IN_USE });

    const messageSendingTime = dayjs().format('HH:mm:ss');
    const statusMessage = {
      from: name,
      to: 'Todos',
      text: 'entra na sala...',
      type: 'status',
      time: messageSendingTime,
    };

    const newParticipant = { name, lastStatus: Date.now() };

    const { error } = schemaParticipant.validate(newParticipant);

    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(422).send(errors);
    }

    await collectionParticipants().insertOne(newParticipant);
    await collectionMessages().insertOne(statusMessage);

    return res.sendStatus(201);
  } catch (err) {
    return res.status(422).json({ error: err });
  }
}

export { returnParticipants, registerParticipant };
