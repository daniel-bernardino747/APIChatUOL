import dayjs from 'dayjs';
import schemaMessage from '../Middlewares/messageMiddleware.js';
import { collectionParticipants, collectionMessages } from '../Utils/collections.js';

async function sendMessage(request, response) {
  const { to, text, type } = request.body;
  const { user: from } = request.headers;

  const existingUser = await collectionParticipants().findOne({ name: from });

  if (!existingUser) {
    return response.status(422).json({ error: 'You are not logged in' });
  }

  const messageSendingTime = dayjs().format('HH:mm:ss');
  const newMessage = {
    from,
    to,
    text,
    type,
    time: messageSendingTime,
  };

  try {
    const { error, value: message } = schemaMessage.validate(newMessage);
    if (error) throw error;

    await collectionMessages().insertOne(message);

    return response.sendStatus(201);
  } catch (err) {
    return response.status(422).json({ error: err });
  }
}

async function returnMessages(request, response) {
  try {
    const { limit: pageLimit } = request.query;
    const { user: participant } = request.headers;

    const existingParticipant = await collectionParticipants().findOne({ name: participant });

    if (!existingParticipant) {
      return response.status(404).json({ error: 'This participant is not in the active users list.' });
    }

    const byTime = { time: -1 };
    const filterToParticipant = {
      $or: [
        { from: participant },
        { to: { $in: ['Todos', participant] } },
      ],
    };

    if (!pageLimit) {
      const allMessages = await collectionMessages().find().toArray();
      return response.status(200).send(allMessages);
    }
    const selectedsMessages = (await collectionMessages().find(filterToParticipant)
      .sort(byTime)
      .limit(Number(pageLimit))
      .toArray())
      .reverse();

    return response.status(200).send(selectedsMessages);
  } catch (err) {
    return response.status(400).json({ error: err });
  }
}

export { returnMessages, sendMessage };
