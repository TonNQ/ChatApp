import axiosInstance from './axios';

export const uploadFile = async (file) => {
  const formData = new FormData();
  if (file !== null) {
    formData.append('file', file);
  }
  const res = await axiosInstance({
    method: 'post',
    url: 'utils/file',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.file;
};
