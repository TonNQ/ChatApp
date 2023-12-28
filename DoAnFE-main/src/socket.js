import io from 'socket.io-client';
import { Config } from './config/config';

const socket = io(Config.BACKEND_URL, {
  path: '/bridge',
  transports: ['websocket'],
});

export default socket;
