import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Paper, PaperProps, Typography, TypographyProps, Button, ButtonProps } from '@mui/material';

interface Props {
  title?: string;
}

const BannerWrapper = styled(Paper)<PaperProps>(() => ({
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
  borderRadius: '22px',
  backgroundColor: '#fff',
  padding: '30px 22px 30px 33px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
}));

const Text = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  fontWeight: '600',
  lineHeight: '30px',
  fontFamily: 'Poppins',
  width: '479px',
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

const BoxRight = styled(Box)<BoxProps>(() => ({
  width: 'calc(100% - 479px)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const Wallet = styled(Box)<BoxProps>(() => ({
  maxWidth: '126px',
  marginRight: '30px',
  overflow: 'hidden',

  span: {
    color: '#BDBDBD',
    fontFamily: 'Poppins',
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const ButtonWallet = styled(Button)<ButtonProps>(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '14px',
  textTransform: 'capitalize',
  boxShadow: 'none',
  background: theme.palette.primary.main,

  '&:hover': {
    opacity: 0.7,
    boxShadow: 'none',
    background: theme.palette.primary.main,
  },
}));

const Banner: React.FC<Props> = () => {
  return (
    <BannerWrapper>
      <Text>Mint 0xBlock Reward Contracts (0xRC) and get steady stream of Rewards in 0xBlock (0xB) tokens</Text>

      <BoxRight>
        <Wallet>
          <span>Wallet</span>
          <Title>0x33434dieoewo</Title>
        </Wallet>
        <ButtonWallet variant="contained" color="primary">
          Disconnect Wallet
        </ButtonWallet>
      </BoxRight>
    </BannerWrapper>
  );
};

export default Banner;
