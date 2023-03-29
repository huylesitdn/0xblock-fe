import React from 'react';
import { styled } from '@mui/material/styles';

import { Box, BoxProps, Typography, TypographyProps, Paper, PaperProps } from '@mui/material';
import { useAppSelector } from 'stores/hooks';

// import bgBorder from 'assets/images/bg-box-gradient.png';

interface Props {
  title?: string;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  marginTop: '35px',
  boxSizing: 'border-box',

  [theme.breakpoints.down('sm')]: {
    padding: '0 14px',
    marginTop: '11px',
  },
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  textAlign: 'center',
  fontSize: '24px',
  lineHeight: '44px',
  color: theme.palette.mode === 'light' ? '#293247' : '#BDBDBD',
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontFamily: 'Poppins',
  margin: '0 0 35px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '20px',
    lineHeight: '32px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '21px',
    lineHeight: '31px',
    marginBottom: '28px',
  },
}));

const Pool = styled(Paper)<PaperProps>(({ theme }) => ({
  borderRadius: '22px',
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
  padding: '26px',
  textAlign: 'center',
  boxSizing: 'border-box',
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: '500',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.primary.main}` : 'none',
  background: theme.palette.mode === 'light' ? '#fff' : `rgba(255, 255, 255, 0.03)`,
  // theme.palette.mode === 'light' ? '#fff' : `url(${bgBorder}) no-repeat center center`,
  backgroundSize: '107%',

  [theme.breakpoints.down('lg')]: {
    padding: '20px',
    fontSize: '12px',
    lineHeight: '18px',
  },
  [theme.breakpoints.down('lg')]: {
    padding: '40px 42px 35px',
    fontSize: '14px',
    lineHeight: '25px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '38px 42px 35px',
    fontSize: '14px',
    lineHeight: '25px',
  },
}));

const ClaimRewards: React.FC<Props> = () => {
  const cashOutFee = useAppSelector((state) => state.contract.tokenDistribution.cashOutFee);

  return (
    <Wrapper>
      <Title>Claim Rewards Tax</Title>
      <Pool>
        {`Every time a user claims rewards, a ${cashOutFee}% tax will be applied and redirected 
        to the 0xBlock Dev/Mktg Wallet as 100% USDC`}
      </Pool>
    </Wrapper>
  );
};

export default ClaimRewards;
