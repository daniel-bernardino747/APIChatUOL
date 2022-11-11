import dayjs from 'dayjs';

async function removalInactiveUsers(db) {
  console.log(db.namespace);
  const dbParticipants = db.collection('test');
  const dbMessages = db.collection('test2');
  const allParticipants = await dbParticipants.find({}).toArray();

  async function removeUser(user) {
    const messageSendingTime = dayjs().format('HH:mm:ss');
    console.log(user.name);
    const newMessage = {
      from: user.name,
      to: 'Todos',
      text: 'sai da sala...',
      type: 'status',
      time: messageSendingTime,
    };

    await dbParticipants.deleteOne({ _id: user._id });
    await dbMessages.insertOne(newMessage);
  }

  allParticipants
    .forEach((user) => {
      const activeUserTime = user.lastStatus;
      console.log(activeUserTime);

      const currentTime = Date.now();
      console.log(currentTime);

      const connectedTime = currentTime - activeUserTime;
      console.log(connectedTime);

      const isLongerThan10Seconds = (connectedTime / 1000) > 10;
      console.log(isLongerThan10Seconds);

      if (isLongerThan10Seconds) {
        removeUser(user);
      }
    });
  console.log(allParticipants);
}

export default removalInactiveUsers;
