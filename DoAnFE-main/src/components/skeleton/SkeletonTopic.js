// @mui
import { Box, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonTopic() {
  return (
    <>
      <Skeleton width="100%" height={200} variant="rectangular" sx={{ borderRadius: 2 }} />
      <Skeleton width="100%" height={600} variant="rectangular" sx={{ borderRadius: 2 }} />
    </>
  );
}
