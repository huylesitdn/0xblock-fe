import BigNumber from 'bignumber.js';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import { SwapTokenId } from 'hooks/swap';
import { TokenData } from 'interfaces';
import { calculateTradingFee } from './calculateTradingFee';

interface Params {
  estimateTokenAmount: string;
  slippageTolerance: string;
  minReceive?: string;
  maxSold?: string;
  tradingFee: string;
  priceImpact: string;
  tokenData: TokenData;
  tokenIn: SwapTokenId;
  tokenOut: SwapTokenId;
  isExactInput: boolean;
}
export const convertTraderJoeRouterData = ({
  estimateTokenAmount,
  slippageTolerance,
  maxSold,
  minReceive,
  tradingFee,
  priceImpact,
  tokenData,
  tokenIn,
  tokenOut,
  isExactInput,
}: Params) => {
  const token = isExactInput ? tokenOut : tokenIn;
  const _tradingFee = isExactInput
    ? new BigNumber(tradingFee).multipliedBy(`1e${tokenData[tokenIn].decimals}`).toString()
    : new BigNumber(tradingFee).toString();

  return {
    estimatedAmountToken: formatPercent(
      new BigNumber(estimateTokenAmount).div(`1e${tokenData[token].decimals}`).toString(),
      10,
      0,
    ),
    slippageTolerance,
    minReceive: minReceive
      ? formatForNumberLessThanCondition({
          value: new BigNumber(minReceive).div(`1e${tokenData[token].decimals}`).toString(),
          minValueCondition: 0.000001,
          callback: formatPercent,
          callBackParams: [6, 0],
        })
      : null,
    maxSold: maxSold
      ? formatForNumberLessThanCondition({
          value: new BigNumber(maxSold).div(`1e${tokenData[token].decimals}`).toString(),
          minValueCondition: 0.000001,
          callback: formatPercent,
          callBackParams: [6, 0],
        })
      : null,
    tradingFee: calculateTradingFee(_tradingFee, tokenData[tokenIn], isExactInput),
    priceImpact,
  };
};
