import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PATH_AUTH } from '../routes/paths';

export default function AuthGuard({ children }) {
  const { auth } = useSelector((state) => state);

  return <>{auth.user !== undefined ? children : <Navigate to={PATH_AUTH.login} replace />}</>;
}
