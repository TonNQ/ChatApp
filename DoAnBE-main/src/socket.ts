import socketIO from 'socket.io';
import { Server } from 'http';
import { ORIGIN, CREDENTIALS } from '@config';

const users = {};
const create = async (socket, id) => {
  if (id) {
    users[id] = socket;
  }
  return id;
};
const all = () => users;
const get = id => users[id];
const remove = id => delete users[id];

function initSocket1(socket) {
  let myId;
  let connection;
  socket
    .on('init', async ({ id }) => {
      await create(socket, id);
      myId = id;
      if (myId) {
        socket.emit('init', { id: myId });
      } else {
        socket.emit('error', { message: 'Failed to generating user id' });
      }
    })
    .on('request', ({ userId, offer }) => {
      const receiver = get(userId);
      console.log('Connected: ', myId, ' - ', userId);
      if (receiver) {
        receiver.emit('request', { from: myId, offer });
      } else {
        socket.emit('error', { message: 'Failed to request' });
      }
    })
    .on('bussy', ({ from, to }) => {
      const receiver = get(to);
      if (receiver) {
        receiver.emit('bussy', { from });
      } else {
        socket.emit('error', { message: 'bussy' });
      }
    })
    .on('answer', ({ userId, answer }) => {
      const receiver = get(userId);
      if (receiver) {
        receiver.emit('answer', { from: myId, answer });
      } else {
        socket.emit('error', { message: 'Failed to answer' });
      }
    })
    .on('connected', ({ connectionTo }) => {
      console.log('Connected: ', myId, ' - ', connectionTo);
      connection = connectionTo;
    })
    .on('end', data => {
      const receiver = get(connection);
      if (receiver) {
        receiver.emit('closeConnection', {});
      }
      connection = null;
    })
    .on('candidate', ({ candidate, userId }) => {
      const receiver = get(userId);
      if (receiver) {
        receiver.emit('candidate', candidate);
      } else {
        socket.emit('error', { message: 'Failed to candidate' });
      }
    })
    .on('stopShareVideo', ({ userId, removeId }) => {
      const receiver = get(userId);
      if (receiver) {
        receiver.emit('stopShareVideo', {});
      } else {
        socket.emit('error', { message: 'Failed to stopShareVideo' });
      }
    })
    .on('disconnect', () => {
      const receiver = get(connection);
      if (receiver) {
        receiver.emit('closeConnection', {});
      }
      remove(myId);
      console.log(myId, 'disconnected');
    });
}

export const initSocket = (server: Server) => {
  const io = new socketIO.Server(server, {
    cors: {
      origin: ORIGIN,
      credentials: CREDENTIALS,
    },
    path: '/bridge',
    transports: ['websocket'],
  });

  io.on('connection', initSocket1);
};
