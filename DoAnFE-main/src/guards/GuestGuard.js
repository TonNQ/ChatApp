import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../routes/paths';

export default function GuestGuard({ children }) {
  const { auth } = useSelector((state) => state);

  return (
    <>
      {(auth.user && auth.user === undefined) || !auth.user ? (
        children
      ) : (
        <Navigate to={PATH_DASHBOARD.general.app} replace />
      )}
    </>
  );
}
