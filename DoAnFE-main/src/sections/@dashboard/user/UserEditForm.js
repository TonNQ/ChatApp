import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, IconButton, InputAdornment, Typography, FormControlLabel } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Config } from '../../../config/config';
import { fData } from '../../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { provinces, districts, communes } from '../../../_mock';
import Iconify from '../../../components/Iconify';
import Label from '../../../components/label';
import { uploadFile } from '../../../utils/upload';
import axiosInstance from '../../../utils/axios';
import { AUTH_TYPES } from '../../../redux/actions/authAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserEditForm.propTypes = {
  currentUser: PropTypes.object,
};

export default function UserEditForm({ currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProvinceKey, setSelectedProvinceKey] = useState('');
  const [selectedDistrictKey, setSelectedDistrictKey] = useState('');

  const handleProvinceChange = (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const provinceKey = selectedOption.getAttribute('data-key');
    setSelectedProvinceKey(provinceKey);
    setValue('province', event.target.value);
  };

  const handleDistrictChange = (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const districtKey = selectedOption.getAttribute('data-key');
    setSelectedDistrictKey(districtKey);
    setValue('district', event.target.value);
  };

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      province: currentUser?.province || '',
      district: currentUser?.district || '',
      commune: currentUser?.commune || '',
      address: currentUser?.address || '',
      avatarUrl: currentUser?.avatarUrl ? `${Config.BACKEND_URL}${currentUser?.avatarUrl}` : '',
      password: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentUser) {
      setSelectedProvinceKey(provinces.find((item) => item.name === currentUser.province)?.idProvince ?? '');
      setSelectedDistrictKey(districts.find((item) => item.name === currentUser.district)?.idDistrict ?? '');
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const onSubmit = async () => {
    try {
      const data = { ...values };
      if (data.password === '') delete data.password;
      if (typeof data.avatarUrl !== 'string' || !data?.avatarUrl.includes(Config.BACKEND_URL)) {
        data.avatarUrl = await uploadFile(values.avatarUrl);
      } else if (data.avatarUrl !== '') {
        data.avatarUrl = currentUser.avatarUrl;
      }
      const res = await axiosInstance.put(`users/${currentUser._id}`, data);
      dispatch({
        type: AUTH_TYPES.UPDATE_USER,
        payload: res.data.data,
      });
      navigate(PATH_DASHBOARD.root);
    } catch (error) {
      console.log(error);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="firstName" label="First name" />
              <RHFTextField name="lastName" label="Last name" />
              <RHFTextField name="address" label="Address" />

              <RHFSelect name="province" label="Province" placeholder="Province" onChange={handleProvinceChange}>
                <option value="" />
                {provinces.map((option) => (
                  <option key={option.idProvince} data-key={option.idProvince} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="district" label="District" placeholder="District" onChange={handleDistrictChange}>
                <option value="" />
                {districts.map((option) =>
                  option.idProvince === selectedProvinceKey ? (
                    <option key={option.idDistrict} data-key={option.idDistrict} value={option.name}>
                      {option.name}
                    </option>
                  ) : null
                )}
              </RHFSelect>
              <RHFSelect name="commune" label="Commune" placeholder="Commune">
                <option value="" />
                {communes.map((option) =>
                  option.idDistrict === selectedDistrictKey ? (
                    <option key={option.idCoummune} value={option.name}>
                      {option.name}
                    </option>
                  ) : null
                )}
              </RHFSelect>

              <RHFTextField name="phoneNumber" label="Phone Number" />

              <RHFTextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
