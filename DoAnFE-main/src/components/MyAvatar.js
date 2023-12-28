import { useSelector } from 'react-redux';
import createAvatar from '../utils/createAvatar';
import Avatar from './Avatar';
import { Config } from '../config/config';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { auth } = useSelector((state) => state);

  return (
    <Avatar
      src={`${Config.BACKEND_URL}${auth?.user?.avatarUrl}`}
      alt={`${auth?.user?.lastName} ${auth?.user?.firstName}`}
      color={
        auth?.user?.avatarUrlL ? 'default' : createAvatar(`${auth?.user?.lastName} ${auth?.user?.firstName}`).color
      }
      {...other}
    >
      {createAvatar(`${auth?.user?.lastName} ${auth?.user?.firstName}`).name}
    </Avatar>
  );
}
