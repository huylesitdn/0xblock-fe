import { useWeb3React } from '@web3-react/core';
import { intervalTime } from 'consts/swap';
import { loadLiquidityPoolInfo } from 'helpers/zap/loadLiquidityPoolInfo';
import { useEffect } from 'react';
import { handleSetIsLiquidityPoolLoaded, handleSetLiquidityPoolData } from 'services/zap';
import { useAppDispatch } from 'stores/hooks';

export const useLoadLiquidityPoolData = () => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  const loadLiquidityPoolData = async () => {
    try {
      const data = await loadLiquidityPoolInfo();
      if (data.length > 0) {
        dispatch(handleSetLiquidityPoolData(data[0]));
      }
      dispatch(handleSetIsLiquidityPoolLoaded(true));
    } catch {}
  };

  useEffect(() => {
    let interval: NodeJS.Timer;
    loadLiquidityPoolData();
    if (account) {
      interval = setInterval(async () => {
        await loadLiquidityPoolData();
      }, intervalTime);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [account]);
};
