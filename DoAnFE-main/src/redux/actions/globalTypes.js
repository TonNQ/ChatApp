export const GLOBALTYPES = {
  ALERT: 'ALERT',
  AUTH: 'AUTH',
};

export const EditData = (data, id, dataReplace) => {
  const contain = data.filter((item) => item.id === id).length > 0;
  if (contain) {
    const newData = data.map((item) => (item.id === id ? dataReplace : item));
    return newData;
  }
  return [...data, dataReplace];
};

export const EditData1 = (data, _id, dataReplace) => {
  const contain = data.filter((item) => item._id === _id).length > 0;
  if (contain) {
    const newData = data.map((item) => (item._id === _id ? dataReplace : item));
    return newData;
  }
  return [...data, dataReplace];
};
export const DeleteData = (data, id) => {
  const newData = data.filter((item) => item.id !== id);
  return newData;
};
