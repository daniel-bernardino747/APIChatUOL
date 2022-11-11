import db from '../server.js';

const collectionParticipants = () => db.collection('test');

async function updateStatus(request, response) {
  const { user: name } = request.headers;

  const dbParticipants = collectionParticipants();
  const existingParticipant = await dbParticipants.findOne({ name });
  console.log(existingParticipant._id);

  if (!existingParticipant) {
    return response.status(404)
      .json({ error: 'This user is not in the list of users to be updated' });
  }

  await dbParticipants.updateOne(
    { _id: existingParticipant._id },
    { $set: { lastStatus: Date.now() } },
  );
  return response.sendStatus(200);
}

export default updateStatus;
