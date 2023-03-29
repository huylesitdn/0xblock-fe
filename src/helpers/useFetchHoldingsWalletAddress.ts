import { useEffect, useState } from 'react';
import { getBalanceTokenUsdcOf } from './interactiveUsdcContract';
import { bigNumber2Number, bigNumber2NumberV3 } from './formatNumber';
import { useAppDispatch } from 'stores/hooks';
import { setHoldings, setLoading } from 'services/holdings';
import OxBCoin from 'assets/images/coin-0xb.svg';
import USDCoin from 'assets/images/coin-usd.svg';
import AVAXCoin from 'assets/images/avalanche-avax-logo.svg';
import axiosInstance from 'utils/AxiosInstance';
import BigNumber from 'bignumber.js';
import { formatReward } from 'helpers/formatReward';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import store from 'stores/store';
import { formatNumberWithComas, truncateNumber } from 'helpers/formatPrice';

export const useFetchHoldingsWalletAddress = () => {
  const dispatch = useAppDispatch();
  const baseUrl = process.env.REACT_APP_API_URL_PRICE_TOKEN_TO_USD;
  const { getBalanceTokenOf, getBalanceNativeTokenOf, getHoldingsWalletAddress } = useInteractiveContract();

  const [totalUsdLocked, setTotalUsdLocked] = useState<string>('0');

  const fetchTokenPrices = async () => {
    const uOxb = `${baseUrl}/${process.env.REACT_APP_CONTRACT_ADDRESS}`;
    const uUsdc = `${baseUrl}/${process.env.REACT_APP_USDC_TOKEN_ADDRESS}`;
    const uAvax = `${baseUrl}/${process.env.REACT_APP_NATIVE_TOKEN_ADDRESS}`;

    try {
      const [price0xb, priceAvax, priceUsdc] = await Promise.all([
        axiosInstance.get(uOxb),
        axiosInstance.get(uAvax),
        axiosInstance.get(uUsdc),
      ]);

      return [
        { name: '0xB', price: bigNumber2NumberV3(price0xb.data) },
        { name: 'AVAX', price: bigNumber2NumberV3(priceAvax.data) },
        { name: 'USDC', price: bigNumber2NumberV3(priceUsdc.data) },
      ];
    } catch (e) {
      return [
        { name: '0xB', price: '0' },
        { name: 'AVAX', price: '0' },
        { name: 'USDC', price: '0' },
      ];
    }
  };

  const fetchBalanceAssetsWallet = async (address: string, computedTotalValueLocked = false) => {
    const [_0xbBalance, _avaxBalance, _usdcBalance, _prices] = await Promise.all([
      getBalanceTokenOf(address),
      getBalanceNativeTokenOf(address),
      getBalanceTokenUsdcOf(address),
      fetchTokenPrices(),
    ]);

    const amount0xb = bigNumber2Number(_0xbBalance[0]);
    const value0xb = new BigNumber(_prices[0].price).times(amount0xb).toString();

    const amountAvax = bigNumber2Number(_avaxBalance);
    const valueAvax = new BigNumber(_prices[1].price).times(amountAvax).toString();

    const amountUsdc = bigNumber2Number(_usdcBalance[0], 1e6);
    const valueUsdc = new BigNumber(_prices[2].price).times(amountUsdc).toString();

    if (computedTotalValueLocked) {
      const { reserve0 } = store.getState().traderJoe.pairData;
      const totalAvaxLocked = new BigNumber(reserve0).plus(amountAvax);

      const totalUsd0xbLocked = new BigNumber(amount0xb).multipliedBy(_prices[0].price);
      const totalUsdAvaxLocked = new BigNumber(totalAvaxLocked).multipliedBy(_prices[1].price);

      const totalUsdLocked = formatNumberWithComas(
        Number(truncateNumber(new BigNumber(totalUsdAvaxLocked).plus(totalUsd0xbLocked).toNumber(), 2)),
      );
      setTotalUsdLocked(totalUsdLocked);
    }

    return [
      { name: '0xB', icon: OxBCoin, value: formatReward(value0xb), amount: formatReward(amount0xb) },
      { name: 'AVAX', icon: AVAXCoin, value: formatReward(valueAvax), amount: formatReward(amountAvax) },
      { name: 'USDC', icon: USDCoin, value: formatReward(valueUsdc), amount: formatReward(amountUsdc) },
    ];
  };

  const fetchResourceHoldings = async () => {
    const [treasuryWallet, liquidityWallet, rewardWallet, devWallet] = await getHoldingsWalletAddress();
    const reserveRewardsWallet = '0xfa4eCa6D583a825B80146B87d10EB24fa79EEdCb';

    const [treasuryAssets, liquidityAssets, rewardAssets, devAssets, reserveRewardsAssets] = await Promise.all([
      fetchBalanceAssetsWallet(treasuryWallet[0], true),
      fetchBalanceAssetsWallet(liquidityWallet[0]),
      fetchBalanceAssetsWallet(rewardWallet[0]),
      fetchBalanceAssetsWallet(devWallet[0]),
      fetchBalanceAssetsWallet(reserveRewardsWallet),
    ]);

    return {
      treasury: treasuryAssets,
      liquidity: liquidityAssets,
      rewards: rewardAssets,
      dev_marketing: devAssets,
      reserve_rewards: reserveRewardsAssets,
    };
  };

  useEffect(() => {
    (async () => {
      dispatch(setLoading(true));
      const resources = await fetchResourceHoldings();
      dispatch(setHoldings(resources));
      dispatch(setLoading(false));
    })();
  }, []);

  return { fetchBalanceAssetsWallet, totalUsdLocked };
};
