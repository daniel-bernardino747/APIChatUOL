import db from '../server.js';
import schemaParticipant from '../Middlewares/participantsMiddleware.js';

const returnColletion = () => db.collection('test');

function returnParticipants(request, response) {
  const Database = returnColletion();

  Database
    .find()
    .toArray()
    .then((allParticipants) => response.status(200).send(allParticipants));
}

async function registerParticipant(request, response) {
  const { name } = request.body;
  const Database = returnColletion();
  const existingUser = await Database.findOne({ name });

  if (existingUser) {
    return response.status(409).json({ error: 'This username already exists.' });
  }

  const newParticipant = {
    name,
    lastStatus: Date.now(),
  };

  try {
    const { error, value: participant } = schemaParticipant.validate(newParticipant);
    if (error) throw error;

    await Database.insertOne(participant);

    return response.status(200).json({ message: 'OK' });
  } catch (err) {
    const messageError = err.details[0].message;

    return response.status(422).json({ error: messageError });
  }
}

export { returnParticipants, registerParticipant };
