import { Token } from '@traderjoe-xyz/sdk';
import { BigNumber } from 'bignumber.js';
import { formatPercent } from 'helpers/formatPrice';

export const calculateTradingFee = (amount: string, token: Token, isExactInput: boolean) => {
  if (isExactInput) {
    const oxbFee = new BigNumber(amount).div(`1e${token.decimals}`).multipliedBy(0.1).div(100);
    const amountAfterMinusOxbFee = new BigNumber(amount).div(`1e${token.decimals}`).minus(oxbFee);
    const traderJoeFee = amountAfterMinusOxbFee.multipliedBy(0.3).div(100);
    const result = formatPercent(oxbFee.plus(traderJoeFee).toString(), 6, 0);
    return Number(result) > 0.000001 ? result : '<0.000001';
  } else {
    const tradingFee = new BigNumber(amount).div(`1e${token.decimals}`).multipliedBy(0.4).div(100);
    const result = formatPercent(tradingFee.toString(), 6, 0);
    return Number(result) > 0.000001 ? result : '<0.000001';
  }
};
