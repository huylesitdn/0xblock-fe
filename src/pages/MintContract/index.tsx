import { Box } from '@mui/material';
import { ClaimRewards, Tokens, TypesReward } from 'components/MintContract';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

interface Props {
  title?: string;
}

const MintContract: React.FC<Props> = () => {
  useEffect(() => {
    toast.clearWaitingQueue();
  }, []);

  return (
    <Box>
      <TypesReward />
      <Tokens />
      <ClaimRewards />
    </Box>
  );
};

export default MintContract;
