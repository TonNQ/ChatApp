import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { toPascalCase } from '../../../utils/formatString';
import Label from '../../../components/label';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Config } from '../../../config/config';

// ----------------------------------------------------------------------

const StyledTopicImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

TopicCard.propTypes = {
  topic: PropTypes.object,
};

const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

export default function TopicCard({ topic }) {
  const { name = '', cover = '', description = '', _id = '' } = topic;
  const navigate = useNavigate();

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledTopicImg alt={name} src={`${Config.BACKEND_URL}${cover}`} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          color="inherit"
          underline="hover"
          onClick={() => {
            navigate(`${PATH_DASHBOARD.topics.root}/${_id}`);
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {toPascalCase(name)}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomWidthTooltip title={description}>
            <Typography
              variant="subtitle1"
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
            >
              <Typography component="span" variant="body1">
                {description}
              </Typography>
            </Typography>
          </CustomWidthTooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
