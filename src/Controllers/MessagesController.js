import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import {
  MESSAGE_DELETED, MESSAGE_NOT_FOUND, NOT_OWNER_MESSAGE, USER_NOT_FOUND,
} from '../Constants/MessageErrors.js';
import { schemaMessage, schemaUpdateMessage } from '../Middlewares/messageMiddleware.js';
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

async function deleteMessage(req, res) {
  const { user } = req.headers;
  const { id } = req.params;

  try {
    const existingMessage = await collectionMessages().find({ _id: ObjectId(id) });
    const isOwnerMessage = existingMessage.from === user;

    if (!isOwnerMessage) return res.status(401).json({ error: NOT_OWNER_MESSAGE });
    if (!existingMessage) return res.status(404).json({ error: MESSAGE_NOT_FOUND });

    await collectionMessages().deleteOne({ _id: ObjectId(id) });

    return res.sendStatus(200).json({ message: MESSAGE_DELETED });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function changeMessage(req, res) {
  const { headers: { user }, params: { id }, body } = req;

  try {
    const existingUser = await collectionParticipants().find({ _id: ObjectId(id) });
    const existingMessage = await collectionMessages().find({ _id: ObjectId(id) });
    const isOwnerMessage = existingMessage.from === user;

    if (!existingMessage) return res.status(404).json({ error: MESSAGE_NOT_FOUND });
    if (!existingUser) return res.status(422).json({ error: USER_NOT_FOUND });
    if (!isOwnerMessage) return res.status(401).json({ error: NOT_OWNER_MESSAGE });

    const { error } = schemaUpdateMessage.validate(body);
    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(422).send(errors);
    }

    await collectionMessages().updateOne({
      _id: ObjectId(id),
    }, { $set: body });

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export {
  returnMessages, sendMessage, deleteMessage, changeMessage,
};
