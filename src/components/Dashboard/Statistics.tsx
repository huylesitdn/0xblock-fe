import React, { useEffect, useState } from 'react';
import 'styles/menus.css';
import { styled } from '@mui/material/styles';

import { Box, Grid, Typography, Button, ButtonProps, BoxProps, TypographyProps } from '@mui/material';
import { TokenDataChart } from 'interfaces/TokenPrice';
import { useAppSelector } from 'stores/hooks';
import { formatPrice } from 'helpers/formatPrice';
import { StatisticDashboard } from 'interfaces/StatisticDashboard';
import { useHistory } from 'react-router-dom';

import TokenBg from 'assets/images/bg-token.png';
import { useFetchNodes } from 'hooks/useFetchNodes';
import useInterval from 'hooks/useInterval';
import { DELAY_TIME, DELAY_TIME_FETCH_PAIR_DATA } from 'consts/typeReward';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatAndTruncateNumber } from 'helpers/formatAndTruncateNumber';
import useFetchRewardAmount from 'hooks/useFetchRewardAmount';
import useFetchPairData from 'hooks/useFetchPairData';
import { useFetchHoldingsWalletAddress } from 'helpers/useFetchHoldingsWalletAddress';

interface Props {
  title?: string;
  data?: TokenDataChart;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 0,

  [theme.breakpoints.down('sm')]: {
    paddingLeft: '14px',
  },
}));

const CardBox = styled(Box)<BoxProps>(({ theme }) => ({
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(129.07deg, #7FB2FE 3.5%, #879FFF 115.01%)'
      : `url(${TokenBg}) no-repeat center -2px`,
  borderRadius: '20px',
  textAlign: 'center',
  padding: '27px',
  boxSizing: 'border-box',
  maxHeight: '190px',
  backdropFilter: 'blur(111px)',
  boxShadow: '0px 66px 35px -48px rgba(25, 21, 48, 0.13)',

  [theme.breakpoints.down('lg')]: {
    padding: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    marginRight: '14px',
    borderRadius: '14px',
    boxShadow: '0px 28px 37px -17px rgba(25, 21, 48, 0.11)',
  },
  [theme.breakpoints.between('xs', 'sm')]: {
    padding: '27px 14px 12px',
  },
}));

const CustomButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.mode === 'light' ? `#293247` : '#fff',
  background:
    theme.palette.mode === 'light'
      ? `${theme.palette.secondary}`
      : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',
  padding: '12px',
  width: '176px',
  fontSize: '14px',
  lineHeight: '21px',
  fontWeight: 'bold',
  textTransform: 'unset',
  boxShadow: '0px 13px 27px rgba(26, 38, 70, 0.09)',
  borderRadius: '14px',
  fontFamily: 'Poppins',

  [theme.breakpoints.down('lg')]: {
    width: '145px',
    padding: '10px',
    fontSize: '13px',
    lineHeight: '19px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '129px',
    padding: '7px',
    fontSize: '14px',
    lineHeight: '21px',
    borderRadius: '9px',
  },

  '&:hover': {
    cursor: 'pointer',
    opacity: 0.7,
    boxShadow: 'none',
  },
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: `#FFFFFF`,
  fontFamily: 'Roboto',
  margin: '15px 0',
  fontSize: '32px',
  lineHeight: '37px',
  fontWeight: 'bold',

  [theme.breakpoints.down('lg')]: {
    fontSize: '28px',
    lineHeight: '31px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
    lineHeight: '28px',
    margin: '15px auto 21px',
  },
}));

const Text = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.mode === 'light' ? `rgba(255, 255, 255, 0.54)` : '#656567',
  margin: '0 0',
  fontSize: '18px',
  lineHeight: '27px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  fontFamily: 'Poppins',

  [theme.breakpoints.down('lg')]: {
    fontSize: '16px',
    lineHeight: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const TotalValueBox = styled(Box)<BoxProps>(({}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100%',
}));

const SliderItem = styled(Box)<BoxProps>(() => ({}));

const Statistics: React.FC<Props> = ({ data }) => {
  const history = useHistory();

  const myContracts = useAppSelector((state) => state.contract.dataMyContracts);
  const myReward = useAppSelector((state) => state.contract.dataRewardAmount);
  const nodes = useAppSelector((state) => state.contract.nodes);
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);

  const [statistic, setStatistic] = useState<StatisticDashboard[]>([]);

  const { fetchNodesOfUser } = useFetchNodes();
  const { fetchRewardAmount } = useFetchRewardAmount();
  const { refresh } = useFetchPairData();
  const { totalUsdLocked } = useFetchHoldingsWalletAddress();

  useEffect(() => {
    setStatistic([
      {
        title: 'Token Price',
        value: data?.price ? formatPrice(String(data.price)) : '0.00',
        nameBtn: 'Buy now',
        linkTo: 'https://traderjoexyz.com/trade/0xD2ad73Ce020911A4C04c284bfd2d451b4A777BDB',
      },
      {
        title: 'MY CONTRACTS',
        value: `${nodes}/100`,
        nameBtn: 'Mint contracts',
        linkTo: '/mint-contracts',
      },
      {
        title: 'My Rewards',
        value: formatForNumberLessThanCondition({
          value: String(myReward),
          minValueCondition: 0.01,
          callback: formatAndTruncateNumber,
          callBackParams: [2], // params for callback function, 2 is number of digits after decimal
        }),
        nameBtn: 'Claim all',
        linkTo: '/my-contracts',
      },
    ]);
  }, [myContracts, myReward, data?.price, nodes]);

  useInterval(async () => {
    if (currentUserAddress) {
      await fetchNodesOfUser(currentUserAddress);
      await fetchRewardAmount();
    }
  }, DELAY_TIME);

  useInterval(() => {
    refresh();
  }, DELAY_TIME_FETCH_PAIR_DATA);

  return (
    <Wrapper>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Grid container spacing={{ sm: '24px', md: '30px' }}>
          {statistic.map((item, i) => (
            <Grid item xs={12} sm={3} key={i}>
              <CardBox>
                <Text variant="h5">{item.title}</Text>
                <Title variant="h2">{item.value}</Title>
                <CustomButton
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (item.linkTo.includes('https')) {
                      window.open(item.linkTo, '_blank');
                      return;
                    }
                    history.push(item.linkTo);
                  }}
                >
                  {item.nameBtn}
                </CustomButton>
              </CardBox>
            </Grid>
          ))}

          <Grid item xs={12} sm={3}>
            <CardBox sx={{ height: '100%' }}>
              <TotalValueBox>
                <Text variant="h5">Total Value lock</Text>
                <Title variant="h2">{`$${totalUsdLocked}`}</Title>
              </TotalValueBox>
            </CardBox>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <div className="scroll-area scroll-area--horizontal">
          <div className="scroll-area__body">
            {statistic.map((item, i) => (
              <div key={i} className={`scroll-area__column item${i + 1}`}>
                <SliderItem key={i}>
                  <CardBox>
                    <Text variant="h5">{item.title}</Text>
                    <Title variant="h2">{item.value}</Title>
                    <CustomButton
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        if (item.linkTo.includes('https')) {
                          window.open(item.linkTo, '_blank');
                          return;
                        }
                        history.push(item.linkTo);
                      }}
                    >
                      {item.nameBtn}
                    </CustomButton>
                  </CardBox>
                </SliderItem>
              </div>
            ))}
            <div key={4} className={`scroll-area__column item${5}`}>
              <SliderItem key={4}>
                <CardBox style={{ height: '156px' }}>
                  <TotalValueBox>
                    <Text variant="h5">Total Value lock</Text>
                    <Title variant="h2">{`$${totalUsdLocked}`}</Title>
                  </TotalValueBox>
                </CardBox>
              </SliderItem>
            </div>
          </div>
        </div>
      </Box>
    </Wrapper>
  );
};

export default Statistics;
