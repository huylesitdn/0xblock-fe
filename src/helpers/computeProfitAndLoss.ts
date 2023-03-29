import BigNumber from 'bignumber.js';

export const computeProfitAndLoss = (cp: number, sp: number): number => {
  const netIncome = new BigNumber(sp).minus(cp);
  return new BigNumber(netIncome).div(cp).times(100).toNumber();
};
