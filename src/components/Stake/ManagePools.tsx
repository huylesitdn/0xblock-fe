import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Grid, Typography, TypographyProps } from '@mui/material';

import { PoolCard } from 'components/Stake';
import { PoolItem } from 'services/staking';
import { useWeb3React } from '@web3-react/core';
import { Empty } from 'components/Zap';
import { SkeletonPoolCard } from './SkeletonPoolCard';
import { useAppSelector } from 'stores/hooks';
interface Props {
  title?: string;
  onNext: (value: number) => void;
  tabChange: (value: 'myPool' | 'allPool') => void;
  pools: PoolItem[];
  onClaimAll: (id: string) => void;
  currentTab: string;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  padding: '0 55px',
  boxSizing: 'border-box',

  [theme.breakpoints.down('lg')]: {
    padding: '0 17px',
  },
}));

const TabCustom = styled(Box)<BoxProps>(({ theme }) => ({
  margin: '49px auto 65px',
  display: 'flex',
  justifyContent: 'center',

  [theme.breakpoints.down('sm')]: {
    margin: '51px auto 9px',
  },
}));

const EmptyBox = styled(Box)<BoxProps>(() => ({
  marginTop: '200px',
}));
const EmptyContracts = styled(Box)<BoxProps>(({ theme }) => ({
  // minHeight: 'calc(100vh - 50px - 315px)',
  minHeight: 'calc(100vh - 50px - 600px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode === 'light' ? '#E0E0E0' : '#6B6B6B',
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: '36px',
  lineHeight: '42px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '30px',
    lineHeight: '38px',
  },
}));
const NoRecordsBox = styled(Typography)<TypographyProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '500px',
  color: theme.palette.mode === 'dark' ? '#ffff' : '#121212',
  width: '100%',
}));

const ManagePools: React.FC<Props> = ({ onNext, tabChange, pools, onClaimAll, currentTab }) => {
  const theme = useTheme();
  const { account } = useWeb3React();
  const totalPools = useAppSelector((state) => state.stake.totalPools);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangeTab = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      tabChange('myPool');
    } else {
      tabChange('allPool');
    }
  };

  return (
    <Wrapper>
      <TabCustom>
        <div className={`toggle-button-cover ${theme.palette.mode}Mode`}>
          <div className="button-cover">
            <div className="button b2 button-10 button-11" id="">
              <input onChange={handleChangeTab} type="checkbox" className="checkbox" />
              <div className="knobs">
                <span>All Pools</span>
              </div>
              <div className="layer" />
            </div>
          </div>
        </div>
      </TabCustom>

      <Box>
        {currentTab === 'allPool' && (
          <Grid container spacing={{ xs: '34px', md: '68px' }}>
            {pools.length > 0
              ? pools.map((item, index) => {
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <PoolCard
                        isOxbPool={item.isOxbPool}
                        onClaimAll={() => {
                          onClaimAll(item.id);
                        }}
                        title={item.title}
                        stakedAmount={item.account === account ? item.yourTotalStakedAmount : '0'}
                        apr={item.apr}
                        liquidity={item.liquidity}
                        onNext={onNext}
                        id={Number(item.id)}
                      />
                    </Grid>
                  );
                })
              : (totalPools || []).map((item, index) => {
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <SkeletonPoolCard />
                    </Grid>
                  );
                })}
          </Grid>
        )}
        {currentTab !== 'allPool' && (
          <>
            {account ? (
              <Grid container spacing={{ xs: '34px', md: '68px' }}>
                {pools.length > 0 ? (
                  pools.map((item, index) => {
                    return (
                      <Grid item xs={12} sm={6} key={index}>
                        <PoolCard
                          isOxbPool={item.isOxbPool}
                          onClaimAll={() => {
                            onClaimAll(item.id);
                          }}
                          title={item.title}
                          stakedAmount={item.account === account ? item.yourTotalStakedAmount : '0'}
                          apr={item.apr}
                          liquidity={item.liquidity}
                          onNext={onNext}
                          id={Number(item.id)}
                        />
                      </Grid>
                    );
                  })
                ) : (
                  <NoRecordsBox>
                    <EmptyContracts>
                      <p>No Records Found</p>
                    </EmptyContracts>
                  </NoRecordsBox>
                )}
              </Grid>
            ) : (
              <EmptyBox>
                <Empty title="You need to connect your wallet to see your Pools." mode="white" />
              </EmptyBox>
            )}
          </>
        )}
      </Box>
    </Wrapper>
  );
};

export default ManagePools;
