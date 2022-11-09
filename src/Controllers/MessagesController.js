import dayjs from 'dayjs';
import db from '../server.js';
import schemaMessage from '../Middlewares/messageMiddleware.js';

const collectionParticipants = () => db.collection('test');
const collectionMessages = () => db.collection('test2');

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
    const messageError = err;
    console.log(err);
    return response.status(422).json({ error: messageError });
  }
}

export default sendMessage;