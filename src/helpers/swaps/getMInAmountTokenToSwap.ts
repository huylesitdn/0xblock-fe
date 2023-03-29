import BigNumber from 'bignumber.js';

export const getMinAmountTokenToSwap = (value: string | null, slippage: string) => {
  const inputValue = new BigNumber(value || 0);
  const OxbFee = inputValue.multipliedBy(0.1).div(100);
  const amountAfterPlusOxbFee = inputValue.plus(OxbFee);
  return amountAfterPlusOxbFee
    .plus(amountAfterPlusOxbFee.multipliedBy(0.3).div(100))
    .plus(inputValue.multipliedBy(slippage).div(100))
    .toNumber();
};
