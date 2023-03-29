import React from 'react';
import { useWindowSize } from 'hooks/useWindowSize';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Grid } from '@mui/material';

import Statistic from 'components/MyContract/Statistic';

import SquareIcon from 'assets/images/square.gif';
import SquareDarkIcon from 'assets/images/square-dark.gif';
import CubeIcon from 'assets/images/cube.gif';
import CubeDarkIcon from 'assets/images/cube-dark.gif';
import TessIcon from 'assets/images/tess.gif';
import TessDarkIcon from 'assets/images/tess-dark.gif';
import RewardsIcon from 'assets/images/rewards.gif';
import RewardsDarkIcon from 'assets/images/rewards-dark.gif';
import { CountMyContract } from 'interfaces/CountMyContract';
import { useAppSelector } from 'stores/hooks';
import { formatReward } from 'helpers';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';

interface Props {
  countMyContract: CountMyContract;
  data: Array<any>;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  // overflow: 'hidden',
  boxSizing: 'border-box',
  margin: '30px 0',

  [theme.breakpoints.down('sm')]: {
    padding: '0 14px',
    margin: '38px 0 40px',
  },
}));

const Stats: React.FC<Props> = ({ countMyContract, data }) => {
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const dataRewardAmount = useAppSelector((state) => state.contract.dataRewardAmount);

  const theme = useTheme();
  const [width] = useWindowSize();

  return (
    <Wrapper sx={{ width: '100%', margin: '30px 0' }}>
      <Grid container spacing={{ xs: '19px', md: '25px' }}>
        <Grid item xs={6} sm={6} md={3}>
          <Statistic
            icon={theme.palette.mode === 'light' ? SquareIcon : SquareDarkIcon}
            color={theme.palette.mode === 'light' ? '#E5E5FE' : '#327DD2'}
            title="Square"
            text="Contract"
            value={countMyContract.square}
            data={data}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Statistic
            icon={theme.palette.mode === 'light' ? CubeIcon : CubeDarkIcon}
            color={theme.palette.mode === 'light' ? '#D2FFDB' : '#2B91CF'}
            title="CUBE"
            text="Contract"
            value={countMyContract.cube}
            data={data}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Statistic
            icon={theme.palette.mode === 'light' ? TessIcon : TessDarkIcon}
            color={
              theme.palette.mode === 'light' ? '#DBECFD' : 'linear-gradient(126.79deg, #2978F4 43.77%, #23ABF8 129.86%)'
            }
            title="Tesseract"
            text="Contract"
            value={countMyContract.tesseract}
            data={data}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Statistic
            color={
              currentUserAddress && data.length > 0
                ? theme.palette.mode === 'light'
                  ? width < 600
                    ? data.length > 0
                      ? '#EFE5FE'
                      : '#F2F2F2'
                    : 'linear-gradient(129.07deg, #7FB2FE 3.5%, #879FFF 115.01%)'
                  : width < 600
                  ? data.length > 0
                    ? 'linear-gradient(138.19deg, #64AADD 45.65%, #2670A5 119.73%)'
                    : '#262626'
                  : data.length > 0
                  ? 'linear-gradient(102.25deg, #2D91D9 -1.96%, #2670A5 97.13%)'
                  : '#3F3F3F'
                : theme.palette.mode === 'light'
                ? width < 600
                  ? '#F2F2F2'
                  : '#FFFFFF'
                : width < 600
                ? '#262626'
                : '#3F3F3F'
            }
            // color={
            //   currentUserAddress#D2FFDB
            //     ? (
            //         width < 600 && theme.palette.mode === 'light'
            //           ? '#EFE5FE'
            //           : 'linear-gradient(138.19deg, #64AADD 45.65%, #2670A5 119.73%)'
            //       )
            //       ? 'linear-gradient(102.25deg, #2D91D9 -1.96%, #2670A5 97.13%)'
            //       : // ? 'linear-gradient(129.07deg, #7FB2FE 3.5%, #879FFF 115.01%)'
            //       dataRewardAmount === 0
            //       ? '#3F3F3F'
            //       : 'linear-gradient(102.25deg, #2D91D9 -1.96%, #2670A5 97.13%)'
            //     : theme.palette.mode === 'light'
            //     ? '#fff'
            //     : '#262626'
            // }
            title={width < 600 ? 'Rewards' : 'My Rewards'}
            value={`${formatForNumberLessThanCondition({
              value: String(dataRewardAmount),
              minValueCondition: 0.001,
              callback: formatReward,
            })}`}
            icon={width < 600 ? (theme.palette.mode === 'light' ? RewardsIcon : RewardsDarkIcon) : null}
            connected={currentUserAddress}
            data={data}
          />
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default Stats;
