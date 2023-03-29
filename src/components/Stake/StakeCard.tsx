import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Typography, TypographyProps, Button, ButtonProps, Grid } from '@mui/material';

import OxToken from 'assets/images/0x-token.png';
import AvaxToken from 'assets/images/avax-token.png';

interface Props {
  title?: String;
}

interface LineProps {
  color: string;
}

const Wrapper = styled(Box)<BoxProps>(() => ({
  width: '100%',
  background: '#FFFFFF',
  border: '1px solid rgba(41, 50, 71, 0.1)',
  boxSizing: 'border-box',
  boxShadow: '0px 2px 17px rgba(213, 215, 222, 0.24)',
  borderRadius: '27px 27px 27px 29px',
  padding: '35px 49px 35px 42px',
}));

const BoxHeader = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '42px',
}));

const ViewIcon = styled(Box)<BoxProps>(() => ({
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  overflow: 'hidden',
  marginRight: '9px',

  img: {
    maxWidth: '100%',
  },
}));

const Title = styled(Typography)<TypographyProps>(() => ({
  marginLeft: '10px',
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '22px',
  lineHeight: '26px',
  letterSpacing: '0.025em',
  color: '#293247',
}));

const BoxContent = styled(Box)<BoxProps>(() => ({
  width: '100%',
}));

const BoxActions = styled(Box)<BoxProps>(() => ({
  width: '100%',
  marginTop: '46px',
}));

const Line = styled(Box)<LineProps>(({ color }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '19px',

  p: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '16px',
    textAlign: 'center',
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: color,
    margin: '0 0',
    minWidth: '100px',

    '&:first-child': {
      marginRight: 'auto',
      textAlign: 'left',
    },

    '&:last-child': {
      marginLeft: 'auto',
      textAlign: 'right',
    },
  },
}));

const ButtonStake = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
  color: '#3864FF',
  textTransform: 'capitalize',
  border: '1px solid #3864FF',
  height: '46px',
  borderRadius: '14px',

  '&:hover': {
    background: '#3864FF',
    borderColor: '#3864FF',
    color: '#fff',
  },
}));

const ButtonClaim = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
  background: '#3864FF',
  color: '#fff',
  textTransform: 'capitalize',
  // border: '1px solid #3864FF',
  height: '46px',
  borderRadius: '14px',
  boxShadow: 'none',

  '&:disabled': {
    background: 'rgba(56, 100, 255, 0.16)',
    color: '#fff',
  },

  '&:hover': {
    background: '#1239C4',
    color: '#fff',
    outline: 'none',
    boxShadow: 'none',
  },
}));

const StakeCard: React.FC<Props> = () => {
  return (
    <Wrapper>
      <BoxHeader>
        <ViewIcon>
          <img alt="" src={OxToken} />
        </ViewIcon>
        <ViewIcon>
          <img alt="" src={AvaxToken} />
        </ViewIcon>
        <Title>0xB/AVAX</Title>
      </BoxHeader>

      <BoxContent>
        <Line color="rgba(41, 50, 71, 0.7)">
          <p>Liquidity</p>
          <p>APR</p>
          <p>Your Stake</p>
        </Line>
        <Line color="#293247">
          <p>$46380</p>
          <p>0%</p>
          <p>600 LP</p>
        </Line>
      </BoxContent>

      <BoxActions>
        <Grid container spacing={'39px'}>
          <Grid item md={6}>
            <ButtonStake variant="outlined" fullWidth>
              Stake
            </ButtonStake>
          </Grid>
          <Grid item md={6}>
            <ButtonClaim variant="contained" fullWidth>
              Claim
            </ButtonClaim>
          </Grid>
        </Grid>
      </BoxActions>
    </Wrapper>
  );
};

export default StakeCard;
