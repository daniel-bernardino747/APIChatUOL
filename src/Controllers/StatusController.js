import { collectionParticipants } from '../Utils/collections.js';

async function updateStatus(request, response) {
  const { user: name } = request.headers;

  const existingParticipant = await collectionParticipants().findOne({ name });

  if (!existingParticipant) {
    return response.status(404)
      .json({ error: 'This user is not in the list of users to be updated' });
  }

  await collectionParticipants().updateOne(
    { _id: existingParticipant._id },
    { $set: { lastStatus: Date.now() } },
  );
  return response.sendStatus(200);
}

export default updateStatus;
