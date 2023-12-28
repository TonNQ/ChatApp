import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../routes/paths';
import { ROLES_ENUM } from '../config/config';

export default function AdminGuard({ children }) {
  const { auth } = useSelector((state) => state);

  return <>{auth.user.role === ROLES_ENUM.ADMIN ? children : <Navigate to={PATH_DASHBOARD.root} replace />}</>;
}
