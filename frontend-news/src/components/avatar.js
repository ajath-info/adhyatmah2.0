import PropTypes from 'prop-types';
import Image from 'next/image';
// mui
import { Box } from '@mui/material';

export default function BlurImageAvatar({ sx, ...props }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 40,
        width: 40,
        borderRadius: '50%',
        overflow: 'hidden',
        ...sx
      }}
    >
      <Image 
        src={props.src || '/images/default-avatar.png'} 
        alt="user avatar" 
        layout="fill" 
        objectFit="cover" 
        {...props} 
      />
    </Box>
  );
}

BlurImageAvatar.propTypes = {
  src: PropTypes.string,
  sx: PropTypes.object
};
