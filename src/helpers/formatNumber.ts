import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

export const bigNumber2Number = (number: BN, base = 1e18): string => {
  return new BigNumber(number._hex).div(base).toString();
};

export const bigNumber2NumberV2 = (number: BN, base = 1e18): number => {
  return new BigNumber(number._hex).div(base).toNumber();
};

export const bigNumber2NumberV3 = (number: string, base = 1e18): string => {
  return new BigNumber(number).div(base).toString();
};

export const bigNumber2NumberV4 = (number: BN, base = 1e18): number => {
  return new BigNumber(number._hex).div(base).integerValue(BigNumber.ROUND_DOWN).toNumber();
};
