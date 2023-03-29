import React, { useEffect } from 'react';

import { Box } from '@mui/material';

import { Holdings, Investments } from 'components/Treasury';
import { toast } from 'react-toastify';

interface Props {
  title?: string;
}

const Treasury: React.FC<Props> = () => {
  useEffect(() => {
    toast.clearWaitingQueue();
  }, []);

  return (
    <Box>
      {/* <Statistics /> */}
      <Holdings />
      <Investments />
    </Box>
  );
};

export default Treasury;
