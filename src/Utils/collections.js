import db from '../server.js';

const collectionParticipants = () => db.collection('participants');
const collectionMessages = () => db.collection('messages');

export { collectionParticipants, collectionMessages };
