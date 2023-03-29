import BigNumber from 'bignumber.js';

export const calculateAmountInMax = (amountIn: string, slippage: string) => {
  return new BigNumber(amountIn)
    .multipliedBy(new BigNumber(100).plus(new BigNumber(slippage)))
    .div(100)
    .toString();
};
