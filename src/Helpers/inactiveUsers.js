import dayjs from 'dayjs';
import { collectionParticipants, collectionMessages } from '../Utils/collections.js';

async function removalInactiveUsers() {
  const allParticipants = await collectionParticipants().find({}).toArray();

  async function removeUser(user) {
    const messageSendingTime = dayjs().format('HH:mm:ss');

    const newMessage = {
      from: user.name,
      to: 'Todos',
      text: 'sai da sala...',
      type: 'status',
      time: messageSendingTime,
    };

    await collectionParticipants().deleteOne({ _id: user._id });
    await collectionMessages().insertOne(newMessage);
  }

  allParticipants
    .forEach((user) => {
      const currentTime = Date.now();
      const activeUserTime = user.lastStatus;
      const connectedTime = currentTime - activeUserTime;

      const isLongerThan10Seconds = (connectedTime / 1000) > 10;

      if (isLongerThan10Seconds) {
        removeUser(user);
      }
    });
}

export default removalInactiveUsers;
