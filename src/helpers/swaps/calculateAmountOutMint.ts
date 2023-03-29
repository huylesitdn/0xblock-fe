import BigNumber from 'bignumber.js';

export const calculateAmountOutMin = (estimatedAmount: string, slippage: string) => {
  const mintSlippage = Number(slippage) < 0.02 ? 0.02 : slippage;
  return new BigNumber(estimatedAmount)
    .multipliedBy(new BigNumber(100).minus(new BigNumber(mintSlippage)))
    .div(100)
    .toString();
};
