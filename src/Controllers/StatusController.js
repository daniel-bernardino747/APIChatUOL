import { collectionParticipants } from '../Utils/collections.js';
import { USER_NOT_FOUND } from '../Constants/MessageErrors.js';

async function updateStatus(req, res) {
  const { user: name } = req.headers;

  try {
    const existingParticipant = await collectionParticipants().findOne({ name });

    if (!existingParticipant) return res.status(404).json({ error: USER_NOT_FOUND });

    await collectionParticipants().updateOne(
      { _id: existingParticipant._id },
      { $set: { lastStatus: Date.now() } },
    );
    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
}

export default updateStatus;
