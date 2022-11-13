import dayjs from 'dayjs';
import { USER_NOT_FOUND } from '../Constants/MessageErrors.js';
import schemaMessage from '../Middlewares/messageMiddleware.js';
import { collectionParticipants, collectionMessages } from '../Utils/collections.js';

async function sendMessage(req, res) {
  const { to, text, type } = req.body;
  const { user: from } = req.headers;

  try {
    const existingUser = await collectionParticipants().findOne({ name: from });

    if (!existingUser) return res.status(422).json({ error: USER_NOT_FOUND });

    const messageSendingTime = dayjs().format('HH:mm:ss');
    const newMessage = {
      from, to, text, type, time: messageSendingTime,
    };

    const { error } = schemaMessage.validate(newMessage);

    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(422).send(errors);
    }
    await collectionMessages().insertOne(newMessage);

    return res.sendStatus(201);
  } catch (err) {
    return res.status(422).json({ error: err });
  }
}

async function returnMessages(req, res) {
  const { limit: pageLimit } = req.query;
  const { user: name } = req.headers;

  try {
    const existingParticipant = await collectionParticipants().findOne({ name });

    if (!existingParticipant) return res.status(404).json({ error: USER_NOT_FOUND });

    const byTime = { time: -1 };
    const filterToParticipant = {
      $or: [
        { from: existingParticipant.name },
        { to: { $in: ['Todos', existingParticipant.name] } },
      ],
    };

    if (!pageLimit) {
      const allMessages = await collectionMessages().find().toArray();
      return res.status(200).send(allMessages);
    }
    const selectedsMessages = (await collectionMessages().find(filterToParticipant)
      .sort(byTime)
      .limit(Number(pageLimit))
      .toArray())
      .reverse();

    return res.status(200).send(selectedsMessages);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
}

export { returnMessages, sendMessage };
