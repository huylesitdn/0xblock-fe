import { InsufficientReservesError, Percent, TokenAmount, Trade, TradeType } from '@traderjoe-xyz/sdk';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { recentTransactionQuery } from 'consts/query';
import { getSwapSettingData } from 'helpers';
import { convertTraderJoeRouterData, getTraderJoeRouter } from 'helpers/swaps';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { setIsInsufficientLiquidityError, setIsLoadEstimateToken, setRecentTransactions } from 'services/swap';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { useQuery } from 'urql';
import { SwapTokenId } from './useSwapToken';

export interface TokenAddresses {
  [SwapTokenId.OXB]: string;
  [SwapTokenId.AVAX]: string;
  [SwapTokenId.USDC]: string;
}

interface loadEstimateTokenParams {
  isExactInput: boolean;
  tokenIn: SwapTokenId;
  tokenOut: SwapTokenId;
  amount: string;
  isSubtractFee?: boolean;
}

export const useLoadSwapData = () => {
  const { account } = useWeb3React();
  const pairsData = useAppSelector((state) => state.swap.pairsData);

  const pairInfoLoaded = useAppSelector((state) => state.swap.pairInfoLoaded);
  const dispatch = useAppDispatch();

  const [recentTransactionResult, reExecuteLoadRecentTransactionQuery] = useQuery({
    query: recentTransactionQuery,
    variables: {
      address: account,
      date: moment().subtract('7', 'days').endOf('day').unix(),
    },
    pause: !account,
    context: useMemo(
      () => ({
        url: process.env.REACT_APP_SWAP_HISTORIES_API_URL,
      }),
      [],
    ),
  });

  const loadRecentTransaction = () => {
    reExecuteLoadRecentTransactionQuery({ requestPolicy: 'network-only' });
  };

  useEffect(() => {
    dispatch(setRecentTransactions(get(recentTransactionResult, 'data.swaps', [])));
  }, [recentTransactionResult.data]);

  const loadEstimateToken = ({
    isExactInput,
    tokenIn,
    tokenOut,
    amount,
    isSubtractFee = true,
  }: loadEstimateTokenParams) => {
    const settingData = getSwapSettingData();

    try {
      dispatch(setIsInsufficientLiquidityError(false));
      dispatch(setIsLoadEstimateToken(true));
      if (!pairInfoLoaded) {
        throw Error('Pairs are not loaded');
      }
      if (Number(amount) === 0) {
        throw Error('Invalid token amount');
      }
      const isNativeTokenIn = tokenIn === SwapTokenId.AVAX;
      const isNativeTokenOut = tokenOut === SwapTokenId.AVAX;
      const zeroSlippageTolerance = new Percent('0', '10000');
      const currentSlippageTolerance = new Percent(String(Number(settingData.slippage) * 1000), '100000');
      const { tokenInRouter, tokenOutRouter, tokenData } = getTraderJoeRouter({
        tokenIn,
        tokenOut,
        isNativeTokenIn,
        isNativeTokenOut,
        pairsData,
      });
      if (isExactInput) {
        if (isEqual(tokenInRouter, tokenOutRouter)) {
          const valueIn = isSubtractFee
            ? new BigNumber(amount)
                .minus(new BigNumber(amount).multipliedBy(0.1).div(100))
                .multipliedBy(`1e${tokenData[tokenIn].decimals}`)
                .toString()
                .split('.')[0]
            : new BigNumber(amount).multipliedBy(`1e${tokenData[tokenIn].decimals}`).toString().split('.')[0];
          const trade = new Trade(
            tokenInRouter,
            new TokenAmount(tokenData[tokenIn], valueIn),
            TradeType.EXACT_INPUT,
            Number(process.env.REACT_APP_CHAIN_ID),
          );
          const estimatedAmountToken = trade.minimumAmountOut(zeroSlippageTolerance).raw.toString();
          return convertTraderJoeRouterData({
            estimateTokenAmount: estimatedAmountToken,
            slippageTolerance: settingData.slippage,
            tradingFee: amount,
            priceImpact:
              Number(trade.priceImpact.toSignificant(6)) > 0.3
                ? String(Number(trade.priceImpact.toSignificant(6)) - 0.3)
                : '0.0001',
            minReceive: trade.minimumAmountOut(currentSlippageTolerance).raw.toString(),
            tokenData,
            tokenIn,
            tokenOut,
            isExactInput: isExactInput,
          });
        } else {
          const valueIn = isSubtractFee
            ? new BigNumber(amount)
                .minus(new BigNumber(amount).multipliedBy(0.1).div(100))
                .multipliedBy(`1e${tokenData[tokenIn].decimals}`)
                .toString()
                .split('.')[0]
            : new BigNumber(amount).multipliedBy(`1e${tokenData[tokenIn].decimals}`).toString().split('.')[0];
          const tradeTokenInToWavax = new Trade(
            tokenInRouter,
            new TokenAmount(tokenData[tokenIn], valueIn),
            TradeType.EXACT_INPUT,
            Number(process.env.REACT_APP_CHAIN_ID),
          );
          const estimatedWavaxAmountToken = tradeTokenInToWavax.minimumAmountOut(zeroSlippageTolerance).raw.toString();
          const priceImpact1 = Number(tradeTokenInToWavax.priceImpact.toSignificant(6)) - 0.3;
          const tradeWavaxToTokenOut = new Trade(
            tokenOutRouter,
            new TokenAmount(tokenData[SwapTokenId.AVAX], estimatedWavaxAmountToken),
            TradeType.EXACT_INPUT,
            Number(process.env.REACT_APP_CHAIN_ID),
          );
          const estimatedAmountToken = tradeWavaxToTokenOut.minimumAmountOut(zeroSlippageTolerance).raw.toString();
          const priceImpact2 = Number(tradeWavaxToTokenOut.priceImpact.toSignificant(6)) - 0.3;
          return convertTraderJoeRouterData({
            estimateTokenAmount: estimatedAmountToken,
            slippageTolerance: settingData.slippage,
            tradingFee: amount,
            priceImpact:
              Number(priceImpact1 + priceImpact2) !== 0 ? String(Number(priceImpact1 + priceImpact2)) : '0.0001',
            minReceive: tradeWavaxToTokenOut.minimumAmountOut(currentSlippageTolerance).raw.toString(),
            tokenData,
            tokenIn,
            tokenOut,
            isExactInput,
          });
        }
      } else {
        if (isEqual(tokenInRouter, tokenOutRouter)) {
          const trade = new Trade(
            tokenInRouter,
            new TokenAmount(
              tokenData[tokenOut],
              new BigNumber(amount).multipliedBy(`1e${tokenData[tokenOut].decimals}`).toString(),
            ),
            TradeType.EXACT_OUTPUT,
            Number(process.env.REACT_APP_CHAIN_ID),
          );
          const estimatedAmountToken = trade.maximumAmountIn(zeroSlippageTolerance).raw.toString();
          const amountTokenAfterAddFee = new BigNumber(estimatedAmountToken).plus(
            new BigNumber(estimatedAmountToken).multipliedBy(0.1).div(100),
          );
          return convertTraderJoeRouterData({
            estimateTokenAmount: amountTokenAfterAddFee.toString(),
            slippageTolerance: settingData.slippage,
            tradingFee: estimatedAmountToken,
            priceImpact:
              Number(trade.priceImpact.toSignificant(6)) > 0.3
                ? String(Number(trade.priceImpact.toSignificant(6)) - 0.3)
                : '0.0001',
            maxSold: amountTokenAfterAddFee
              .plus(amountTokenAfterAddFee.multipliedBy(settingData.slippage).div(100))
              .toString(),
            tokenData,
            tokenIn,
            tokenOut,
            isExactInput,
          });
        } else {
          const tradeTokenOutToWavax = new Trade(
            tokenOutRouter,
            new TokenAmount(
              tokenData[tokenOut],
              new BigNumber(amount).multipliedBy(`1e${tokenData[tokenOut].decimals}`).toString(),
            ),
            TradeType.EXACT_OUTPUT,
            Number(process.env.REACT_APP_CHAIN_ID),
          );
          const estimatedAmountWAavaxIn = tradeTokenOutToWavax.maximumAmountIn(zeroSlippageTolerance).raw.toString();
          const priceImpact1 = Number(tradeTokenOutToWavax.priceImpact.toSignificant(6)) - 0.3;
          const tradeWavaxToTokenIn = new Trade(
            tokenInRouter,
            new TokenAmount(tokenData[SwapTokenId.AVAX], estimatedAmountWAavaxIn),
            TradeType.EXACT_OUTPUT,
            Number(process.env.REACT_APP_CHAIN_ID),
          );
          const estimatedAmountToken = tradeWavaxToTokenIn.maximumAmountIn(zeroSlippageTolerance).raw.toString();
          const amountTokenAfterAddFee = new BigNumber(estimatedAmountToken).plus(
            new BigNumber(estimatedAmountToken).multipliedBy(0.1).div(100),
          );

          const priceImpact2 = Number(tradeWavaxToTokenIn.priceImpact.toSignificant(6)) - 0.3;
          return convertTraderJoeRouterData({
            estimateTokenAmount: amountTokenAfterAddFee.toString(),
            slippageTolerance: settingData.slippage,
            tradingFee: estimatedAmountToken,
            priceImpact:
              Number(priceImpact1 + priceImpact2) !== 0 ? String(Number(priceImpact1 + priceImpact2)) : '0.0001',
            maxSold: amountTokenAfterAddFee
              .plus(amountTokenAfterAddFee.multipliedBy(settingData.slippage).div(100))
              .toString(),
            tokenData,
            tokenIn,
            tokenOut,
            isExactInput,
          });
        }
      }
    } catch (error: any) {
      if (error instanceof InsufficientReservesError) {
        dispatch(setIsInsufficientLiquidityError(true));
      }
      return {
        estimatedAmountToken: '',
        slippageTolerance: settingData!.slippage,
        minReceive: null,
        maxSold: '0',
        tradingFee: '0',
        priceImpact: '0',
      };
    } finally {
      dispatch(setIsLoadEstimateToken(false));
    }
  };

  return {
    loadRecentTransaction,
    loadEstimateToken,
  };
};
