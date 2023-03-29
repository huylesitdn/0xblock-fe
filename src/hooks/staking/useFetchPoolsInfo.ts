import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'bignumber.js';
import { calculateApr, fetchTokensPrice } from 'helpers/staking';
import { SwapTokenId } from 'hooks/swap';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { useEstimateLPTokenAmount } from 'hooks/zap/useEstimateLPtokenAmount';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPools } from 'services/staking';
import { useAppSelector } from 'stores/hooks';
import get from 'lodash/get';

export const useFetchPoolsInfo = () => {
  const { getJsonAllPool, getJsonAllPoolByUser } = useInteractiveContract();
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const { handleEstimateZapOutLpTokenAmount } = useEstimateLPTokenAmount();
  const liquidityPoolData = useAppSelector((state) => state.zap.liquidityPoolData);
  const isLiquidityPoolLoaded = useAppSelector((state) => state.zap.isLiquidityPoolLoaded);
  const pairInfoLoaded = useAppSelector((state) => state.swap.pairInfoLoaded);
  const totalPools = useAppSelector((state) => state.stake.totalPools);

  const handleLoadPools = async () => {
    const lpToUsdcAmount = handleEstimateZapOutLpTokenAmount(SwapTokenId.USDC, '1', liquidityPoolData);

    const [OxbPrice, rawPools, usePoolsInfo] = await Promise.all([
      fetchTokensPrice(String(process.env.REACT_APP_CONTRACT_ADDRESS).toLocaleLowerCase()),
      getJsonAllPool(),
      account ? getJsonAllPoolByUser(account) : [],
    ]);

    const pools = rawPools.map((item) => {
      const userPool = usePoolsInfo.filter((pool) => pool.index === item.index);
      const yourTotalStakedAmount =
        userPool.length > 0 ? new BigNumber(userPool[0].stakedAmount).div(1e18).toString() : '0';
      const yourTotalRewardAmount =
        userPool.length > 0 ? new BigNumber(userPool[0].pendingReward).div(1e18).toString() : '0';
      const yourStakingTime = userPool.length > 0 ? userPool[0].minTimestamp : '0';
      const isOxbPool =
        `0x${String(item.stakingTokenAddress).toLocaleLowerCase()}` ===
        String(process.env.REACT_APP_CONTRACT_ADDRESS).toLocaleLowerCase();

      return {
        id: String(item.index),
        liquidity: new BigNumber(item.stakedAmountInPool)
          .div(1e18)
          .multipliedBy(isOxbPool ? get(OxbPrice, '[0].priceUSD', '0') : lpToUsdcAmount)
          .toString(),
        totalStaked: new BigNumber(item.stakedAmountInPool).div(1e18).toString(),
        apr:
          item.stakedAmountInPool !== '0'
            ? calculateApr({
                totalReward: new BigNumber(item.totalDistribute).div(1e18).toString(),
                oxbPrice: get(OxbPrice, '[0].priceUSD', '0'),
                totalStaked: new BigNumber(item.stakedAmountInPool).div(1e18).toString(),
                lpPrice: lpToUsdcAmount,
                isOxbPool,
              })
            : '0',
        endTime: new BigNumber(item.duration).toString(),
        yourShare:
          yourTotalStakedAmount !== '0'
            ? new BigNumber(yourTotalStakedAmount)
                .div(new BigNumber(item.stakedAmountInPool).div(1e18))
                .multipliedBy(100)
                .toString()
            : '0',
        yourTotalStakedAmount: String(yourTotalStakedAmount),
        yourTotalRewardAmount: String(yourTotalRewardAmount),
        yourTotalRewardValue: new BigNumber(yourTotalRewardAmount)
          .multipliedBy(get(OxbPrice, '[0].priceUSD', 0))
          .toString(),
        yourStakingTime,
        lpAddress: `0x${String(item.stakingTokenAddress).toLocaleLowerCase()}`,
        title: item.name,
        account,
        isOxbPool,
      };
    });
    dispatch(setPools(pools));
  };

  useEffect(() => {
    if (isLiquidityPoolLoaded && pairInfoLoaded && totalPools) {
      handleLoadPools();
    }
  }, [liquidityPoolData, isLiquidityPoolLoaded, pairInfoLoaded, account, totalPools]);
};
