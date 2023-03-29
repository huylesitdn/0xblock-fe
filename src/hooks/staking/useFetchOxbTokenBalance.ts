import { useWeb3React } from '@web3-react/core';
import { usdcAbi } from 'abis/avalanche';
import { getBalanceIntervalTime } from 'consts/swap';
import { getTokenBalanceFromWalletAddress } from 'helpers';
import { getTokenAllowanceFromWalletAddress } from 'helpers/getTokenBalanceFromWalletAddress';
import { useEffect } from 'react';
import { setOxbToken } from 'services/staking';
import { useAppDispatch } from 'stores/hooks';

export const useFetchOxbTokenBalance = () => {
  const { account } = useWeb3React();
  const dispatch = useAppDispatch();

  const handleGetTokenBalances = async () => {
    const tokenBalance = await getTokenBalanceFromWalletAddress(
      String(process.env.REACT_APP_CONTRACT_ADDRESS),
      usdcAbi,
      account!,
    );
    const allowanceAmount = await getTokenAllowanceFromWalletAddress(
      String(process.env.REACT_APP_CONTRACT_ADDRESS),
      usdcAbi,
      account!,
      String(process.env.REACT_APP_STAKING_MANAGER),
      String(process.env.REACT_APP_CONTRACT_DECIMAL),
    );
    dispatch(
      setOxbToken({
        balance: tokenBalance,
        allowance: allowanceAmount,
      }),
    );
  };

  useEffect(() => {
    handleGetTokenBalances();
    let getTokenBalancesInterval: NodeJS.Timer;
    if (account) {
      getTokenBalancesInterval = setInterval(handleGetTokenBalances, getBalanceIntervalTime);
    }
    return () => {
      if (getTokenBalancesInterval) {
        clearInterval(getTokenBalancesInterval);
      }
    };
  }, [account]);

  return {
    handleGetTokenBalances,
  };
};
