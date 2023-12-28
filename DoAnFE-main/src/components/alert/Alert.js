import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import Toast from './Toast';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Alert = () => {
  const { alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div>
      {alert.loading && <Loading />}
      {alert.error && (
        <Toast msg={alert.error} handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })} type="Error" />
      )}
      {alert.success && (
        <Toast
          msg={alert.success}
          handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
          type="Success"
        />
      )}
    </div>
  );
};

export default Alert;
