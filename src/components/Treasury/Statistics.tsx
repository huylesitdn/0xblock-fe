import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Grid, Typography, TypographyProps } from '@mui/material';
import { useWindowSize } from 'hooks/useWindowSize';
import AreaChartCustom from 'components/Base/AreaChart';

import BgBox1 from 'assets/images/bg-trea-1.png';
import BgBox2 from 'assets/images/bg-trea-2.png';

interface Props {
  title?: string;
}

interface BoxLeftProps extends BoxProps {
  isMarket: boolean;
}

interface BoxDetailProps extends BoxProps {
  isMarket: boolean;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  marginTop: '30px',

  [theme.breakpoints.down('lg')]: {
    marginTop: '30px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0 14px',
  },
}));

const BoxDetail = styled(Box)<BoxDetailProps>(({ theme, isMarket }) => ({
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(129.07deg, #7FB2FE 3.5%, #879FFF 115.01%), #FFFFFF'
      : `url(${isMarket ? BgBox2 : BgBox1}) no-repeat left center`,
  // : 'rgba(255, 255, 255, 0.03)',
  // : `url(${BgBox}) no-repeat center -2px`,
  backgroundSize: 'cover',
  boxShadow: '0px 66px 35px -48px rgba(25, 21, 48, 0.13)',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  padding: '2px',
  height: '190px',
  boxSizing: 'border-box',

  [theme.breakpoints.up('xl')]: {
    height: 'auto',
  },
  [theme.breakpoints.down('lg')]: {
    height: 'auto',
  },
  [theme.breakpoints.down('md')]: {
    // display: 'inline-block',
    width: '100%',
    // padding: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
  },
}));

const BoxTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: '32px',
  lineHeight: '37px',
  color: '#FFFFFF',

  [theme.breakpoints.down('lg')]: {
    fontSize: '26px',
    lineHeight: '34px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '32px',
    lineHeight: '37px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
    lineHeight: '37px',
  },
}));

const BoxText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '14px',
  lineHeight: '21px',
  textTransform: 'uppercase',
  color: theme.palette.mode === 'light' ? '#C5D9FF' : '#656567',
  maxWidth: '163px',
  marginBottom: '15px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
  [theme.breakpoints.down('md')]: {
    // textAlign: 'center',
    // margin: '0 auto 15px',
    fontSize: '14px',
    lineHeight: '21px',
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    margin: '0 auto 15px',
    fontSize: '14px',
    lineHeight: '21px',
  },
}));

const BoxText2 = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '18px',
  lineHeight: '27px',
  textTransform: 'uppercase',
  color: theme.palette.mode === 'light' ? '#C5D9FF' : '#656567',
  maxWidth: '163px',
  marginBottom: '15px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '16px',
    lineHeight: '22px',
  },
  [theme.breakpoints.down('md')]: {
    // textAlign: 'center',
    // margin: '0 auto 15px',
    fontSize: '18px',
    lineHeight: '27px',
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    margin: '0 auto 15px',
    fontSize: '18px',
    lineHeight: '27px',
  },
}));

const BoxLeft = styled(Box)<BoxLeftProps>(({ theme, isMarket }) => ({
  width: 'calc(100% - 290px)',
  padding: isMarket ? '30px 16px 30px 30px' : '30px',
  boxSizing: 'border-box',

  [theme.breakpoints.up('xl')]: {
    width: '50%',
  },
  [theme.breakpoints.down('lg')]: {
    width: '50%',
    padding: '20px',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
    padding: '17px 0px 23px',
  },
}));

const BoxRight = styled(Box)<BoxProps>(({ theme }) => ({
  width: '290px',
  background: theme.palette.mode === 'light' ? '#FFFFFF' : '#212121',
  boxShadow: theme.palette.mode === 'light' ? '0px 4px 26px rgba(0, 0, 0, 0.12)' : 'none',
  borderRadius: '17px',
  padding: '10px 28px 10px 5px',
  boxSizing: 'border-box',
  position: 'relative',

  [theme.breakpoints.up('xl')]: {
    width: '50%',
  },
  [theme.breakpoints.down('lg')]: {
    width: '50%',
    paddingRight: '15px',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const TitleChart = styled(Typography)<TypographyProps>(({ theme }) => ({
  position: 'absolute',
  zIndex: '2',
  top: '2px',
  left: '70px',
  fontFamily: 'Roboto',
  fontWeight: 'normal',
  fontSize: '12px',
  lineHeight: '14px',
  textAlign: 'center',
  color: theme.palette.mode === 'light' ? '#000000' : '#4F4F4F',
}));

const Statistics: React.FC<Props> = () => {
  const [width] = useWindowSize();
  const theme = useTheme();
  const [screenSize, setScreenSize] = useState(width);

  useEffect(() => {
    setScreenSize(width);
  }, [width]);

  return (
    <Wrapper className="treasury-statistics">
      <Grid container spacing={{ xs: '20px', md: '24px', lg: '39px' }}>
        <Grid item xs={12} sm={12} md={6}>
          <BoxDetail isMarket={false}>
            <BoxLeft isMarket={false}>
              <BoxText>Circulation Supply / Total Supply</BoxText>
              <BoxTitle>10M/ 16M</BoxTitle>
            </BoxLeft>
            <BoxRight>
              <div
                style={{
                  width: screenSize > 600 ? 'calc(100% + 30px)' : 'calc(100% + 30px)',
                  // height: { md: '140px', lg: '181px' },
                  height:
                    screenSize > 2559
                      ? '270px'
                      : screenSize > 1560
                      ? '220px'
                      : screenSize > 899
                      ? '181px'
                      : screenSize > 599
                      ? '240px'
                      : '179px',
                  minHeight: '100%',
                  marginLeft: screenSize > 599 ? '-35px' : '-30px',
                  marginBottom: '-15px',
                  position: 'relative',
                }}
              >
                <TitleChart>1 Month</TitleChart>
                <AreaChartCustom
                  id="colorUv"
                  color={theme.palette.mode === 'light' ? '#E5F5FE' : '#29445C'}
                  dataKey="circulationSupply"
                  data={[]}
                />
              </div>
            </BoxRight>
          </BoxDetail>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <BoxDetail isMarket={true}>
            <BoxLeft isMarket={true}>
              <BoxText2>Market Cap</BoxText2>
              <BoxTitle>16M</BoxTitle>
            </BoxLeft>
            <BoxRight>
              <div
                style={{
                  width: screenSize > 600 ? 'calc(100% + 30px)' : 'calc(100% + 30px)',
                  // height: { md: '140px', lg: '181px' },
                  height:
                    screenSize > 2559
                      ? '270px'
                      : screenSize > 1560
                      ? '220px'
                      : screenSize > 899
                      ? '181px'
                      : screenSize > 599
                      ? '240px'
                      : '179px',
                  minHeight: '100%',
                  marginLeft: screenSize > 599 ? '-35px' : '-30px',
                  marginBottom: '-15px',
                  position: 'relative',
                }}
              >
                <TitleChart>1 Month</TitleChart>
                <AreaChartCustom
                  id="colorUv2"
                  dataKey="marketCap"
                  data={[]}
                  color={theme.palette.mode === 'light' ? '#E5E8FE' : '#56CCF2'}
                />
              </div>
            </BoxRight>
          </BoxDetail>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default Statistics;
