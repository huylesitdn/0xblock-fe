import { Box, Grid } from '@mui/material';
import PriceChart from 'components/Dashboard/PriceChart';
import Statistics from 'components/Dashboard/Statistics';
import TotalMinted from 'components/Dashboard/TotalMinted';
import useFetchInforContract from 'hooks/useFetchInforContract';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetchTokenData from 'hooks/useFetchTokenData';
import { useAppSelector } from 'stores/hooks';
import { TokenDataChart, TokenDataTraderJoe } from 'interfaces/TokenPrice';
import useInterval from 'hooks/useInterval';
import { DELAY_TIME } from 'consts/dashboard';
import BigNumber from 'bignumber.js';
import { bigNumber2Number } from 'helpers/formatNumber';
import { useInteractiveContract } from 'hooks/useInteractiveContract';

interface DashboardProps {
  name?: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const tokenData = useAppSelector((state) => state.traderJoe.tokenData);
  const { getTotalSupply } = useInteractiveContract();
  const [heightTotal, setHeightTotal] = useState<any>(null);
  const [dataChart, setDataChart] = useState<TokenDataChart[]>([]);
  const [totalSupply, setTotalSupply] = useState<string>('0');
  const { refresh } = useFetchTokenData();

  const handleChangeHeightTotal = (height: number) => {
    setHeightTotal(height);
  };

  const fetchTotalSupply = async () => {
    const response = await getTotalSupply();

    setTotalSupply(bigNumber2Number(response[0]));
  };

  useFetchInforContract();

  useEffect(() => {
    toast.clearWaitingQueue();
    fetchTotalSupply();
  }, []);

  useEffect(() => {
    if (tokenData.length > 0) {
      const data: TokenDataChart[] = tokenData
        .map((item: TokenDataTraderJoe) => ({
          date: Number(item.date),
          price: Number(item.priceUSD),
          marketCap: new BigNumber(totalSupply).multipliedBy(item.priceUSD).toNumber(),
        }))
        .sort((el1: TokenDataChart, el2: TokenDataChart) => (el1.date > el2.date ? 1 : -1));
      setDataChart(data);
    }
  }, [tokenData, totalSupply]);

  useInterval(() => {
    refresh();
  }, DELAY_TIME);

  return (
    <Box>
      <Box mt={{ xs: '28px', md: '30px' }} mb={{ xs: '34px', md: '50px' }}>
        <Statistics data={_.last(dataChart)} />
      </Box>

      <Grid container spacing={{ xs: '15px', md: '30px' }}>
        <Grid item xs={12} md={4}>
          <TotalMinted onChangeHeight={handleChangeHeightTotal} />
        </Grid>
        <Grid item xs={12} md={8}>
          <PriceChart heightTotal={heightTotal} data={dataChart} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
