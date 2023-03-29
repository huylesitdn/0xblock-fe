import React from 'react';
import 'styles/menus.css';
import { styled } from '@mui/material/styles';

import { Box, BoxProps, Typography, TypographyProps, Grid } from '@mui/material';

import bgBox from 'assets/images/bg-box.png';
import { useAppSelector } from 'stores/hooks';

interface Props {
  title?: string;
}

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  textAlign: 'center',
  fontSize: '24px',
  lineHeight: '44px',
  color: theme.palette.mode === 'light' ? '#293247' : '#BDBDBD',
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontFamily: 'Poppins',
  margin: '0 0 41px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '20px',
    lineHeight: '32px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '21px',
    lineHeight: '31px',
    maxWidth: '249px',
    margin: '0 auto 21px',
  },
}));

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  marginTop: '35px',
  boxSizing: 'border-box',

  [theme.breakpoints.down('sm')]: {
    paddingLeft: '14px',
  },
}));

const BoxSale = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'relative',
  padding: '20px 40px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '22px',
  boxSizing: 'border-box',
  boxShadow: theme.palette.mode === 'light' ? '0px 0px 48px rgba(0, 0, 0, 0.06)' : 'unset',
  height: '100%',
  minHeight: '123px',
  background: theme.palette.mode === 'light' ? '#fff' : `url(${bgBox}) no-repeat center center `,
  backgroundSize: theme.palette.mode === 'light' ? 'unset' : 'cover',

  [theme.breakpoints.down('lg')]: {
    padding: '16px 24px',
    minHeight: '100px',
  },
  [theme.breakpoints.down('sm')]: {
    marginRight: '30px',
    maxWidth: '265px',
    height: '123px',
  },
}));

const Text = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontWeight: '500',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  fontFamily: 'Poppins',
  // maxWidth: '186px',

  span: {
    fontWeight: 'bold',
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : '#579AFF',
  },

  [theme.breakpoints.down('lg')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    lineHeight: '18px',
    whiteSpace: 'normal',
  },
}));

const Sale = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  top: '-25px',
  left: '-18px',
  zIndex: '2',
  width: '57px',
  height: '57px',
  borderRadius: '15px',
  boxShadow: '0px 14px 26px -2px rgba(0, 0, 0, 0.14)',
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(112.15deg, #A5C7FB -10.8%, #C0CAFF 107.36%)'
      : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '18px',
  lineHeight: '27px',
  textTransform: 'uppercase',
  color: '#fff',

  [theme.breakpoints.down('lg')]: {
    fontSize: '14px',
    lineHeight: '20px',
    width: '46px',
    height: '46px',
    top: '-22px',
    left: '-12px',
  },
}));

const SliderItem = styled(Box)<BoxProps>(() => ({
  paddingTop: '23px',
  paddingLeft: '13px',
  boxSizing: 'border-box',
  position: 'relative',
}));

const Tokens: React.FC<Props> = () => {
  const tokenDistribution = useAppSelector((state) => state.contract.tokenDistribution);

  return (
    <Wrapper>
      <Title>Minted Contract Tokens Distribution</Title>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <BoxSale>
              <Sale>{`${tokenDistribution.developmentFee}%`}</Sale>
              <Text>
                <span>Tokens</span> in Development/Marketing Wallet as 100% USDC
              </Text>
            </BoxSale>
          </Grid>
          {/*<Grid item xs={12} sm={6} md={3} lg={3}>*/}
          {/*  <BoxSale>*/}
          {/*    <Sale>{`${tokenDistribution.liquidityPoolFee}%`}</Sale>*/}
          {/*    <Text>*/}
          {/*      <span>Tokens</span> in Liquidity Wallet*/}
          {/*    </Text>*/}
          {/*  </BoxSale>*/}
          {/*</Grid>*/}
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <BoxSale>
              <Sale>{`${tokenDistribution.treasuryFee}%`}</Sale>
              <Text>
                <span>Tokens</span> in Treasury Wallet as 100% 0xB
              </Text>
            </BoxSale>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <BoxSale>
              <Sale>{`${tokenDistribution.rewardsFee}%`}</Sale>
              <Text>
                <span>Tokens</span> in Rewards Wallet as 100% 0xB
              </Text>
            </BoxSale>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <div className="scroll-area scroll-area--horizontal">
          <div className="scroll-area__body">
            <div className="scroll-area__column item1">
              <SliderItem>
                <BoxSale>
                  <Sale>{`${tokenDistribution.developmentFee}%`}</Sale>
                  <Text>
                    <span>Token</span> in Development/ Marketing Wallet as 100% USDC
                  </Text>
                </BoxSale>
              </SliderItem>
            </div>

            {/*<div className="scroll-area__column item2">*/}
            {/*  <SliderItem>*/}
            {/*    <BoxSale>*/}
            {/*      <Sale>{`${tokenDistribution.liquidityPoolFee}%`}</Sale>*/}
            {/*      <Text>*/}
            {/*        <span>Token</span> in Liquidity Pool as 50% 0xB and 50% AVAX*/}
            {/*      </Text>*/}
            {/*    </BoxSale>*/}
            {/*  </SliderItem>*/}
            {/*</div>*/}

            <div className="scroll-area__column item3">
              <SliderItem>
                <BoxSale>
                  <Sale>{`${tokenDistribution.treasuryFee}%`}</Sale>
                  <Text>
                    <span>Token</span> in Treasury Wallet as 100% USDC
                  </Text>
                </BoxSale>
              </SliderItem>{' '}
            </div>

            <div className="scroll-area__column item4">
              <SliderItem>
                <BoxSale>
                  <Sale>{`${tokenDistribution.rewardsFee}%`}</Sale>
                  <Text>
                    <span>Token</span> in Rewards Wallet as 100% 0xB
                  </Text>
                </BoxSale>
              </SliderItem>
            </div>
          </div>
        </div>
      </Box>
    </Wrapper>
  );
};

export default Tokens;
