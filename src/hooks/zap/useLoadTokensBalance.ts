import { TokenItem } from 'pages/Swap';
import get from 'lodash/get';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { usdcAbi } from 'abis/rinkeby';
import { bigNumber2Number } from 'helpers/formatNumber';
import BigNumber from 'bignumber.js';
import { SwapTokenId } from 'hooks/swap';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { handleSetTokenBalances } from 'services/swap';
import { useEffect } from 'react';
import { getBalanceIntervalTime } from 'consts/swap';
import { handleSetZapTokenBalances } from 'services/zap';

export const useLoadTokensBalance = (tokenList: TokenItem[], account?: string | null, isZapPage = false) => {
  const { getBalanceNativeTokenOf, multipleCall } = useInteractiveContract();
  const dispatch = useAppDispatch();

  const tokenAddresses = useAppSelector((state) => state.swap.tokenAddress);

  const handleGetNativeToken = async (address: string) => {
    const avaxToken = await getBalanceNativeTokenOf(address);
    const avaxAmount = bigNumber2Number(avaxToken);
    return avaxAmount;
  };

  const handleLoadTokensBalance = async () => {
    if (account) {
      const nativeTokenBalance = await handleGetNativeToken(account);
      const multiCallParams = tokenList
        .filter((item) => !item.isNative)
        .map((item) => {
          return {
            reference: item.id,
            contractAddress: tokenAddresses[item.id],
            abi: usdcAbi,
            calls: [
              {
                reference: 'balance',
                methodName: 'balanceOf',
                methodParameters: [account],
              },
              {
                reference: 'allowance',
                methodName: 'allowance',
                methodParameters: [
                  account,
                  !isZapPage ? process.env.REACT_APP_CONTRACT_ADDRESS : process.env.REACT_APP_ZAP_MANAGER,
                ],
              },
            ],
          };
        });
      const results = await multipleCall(multiCallParams);
      const newTokenList = tokenList.map((item) => {
        if (item.isNative) {
          return {
            ...item,
            balance: nativeTokenBalance,
          };
        } else {
          const rawBalance = get(results, `[${item.id}].callsReturnContext[0].returnValues[0]`, 0) as any;
          const allowance = get(results, `[${item.id}].callsReturnContext[1].returnValues[0]`, 0) as any;
          return {
            ...item,
            balance: new BigNumber(rawBalance.hex).div(Number(`1e${item.decimal}`)).toString(),
            allowanceBalance:
              item.id === SwapTokenId.OXB || item.id === SwapTokenId.AVAX
                ? item.allowanceBalance
                : new BigNumber(allowance.hex || '0').div(Number(`1e${item.decimal}`)).toString(),
          };
        }
      });
      return newTokenList;
    } else {
      return tokenList.map((item) => {
        return {
          ...item,
          balance: '0',
          allowanceBalance: item.id === SwapTokenId.OXB || item.id === SwapTokenId.AVAX ? item.allowanceBalance : '0',
        };
      });
    }
  };
  const handleGetTokenBalances = async () => {
    const response = await handleLoadTokensBalance();
    let newTokens = response;
    if (isZapPage) {
      newTokens = response!.map((item) => ({
        ...item,
        disabled: false,
      }));
      dispatch(handleSetZapTokenBalances(newTokens));
    } else {
      dispatch(handleSetTokenBalances(newTokens));
    }
  };

  useEffect(() => {
    const nativeToken = tokenList.filter((item) => item.id === SwapTokenId.AVAX);
    const OxbToken = tokenList.filter((item) => item.id === SwapTokenId.OXB);
    const usdcToken = tokenList.filter((item) => item.id === SwapTokenId.USDC);
    const usdtToken = tokenList.filter((item) => item.id === SwapTokenId.USDT);
    if (
      !account &&
      (Number(nativeToken[0].balance) > 0 ||
        Number(OxbToken[0].balance) > 0 ||
        Number(usdcToken[0].balance) > 0 ||
        Number(usdtToken[0].balance) > 0)
    ) {
      handleGetTokenBalances();
    }
  }, [tokenList, account]);

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
