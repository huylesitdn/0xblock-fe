import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { bigNumber2Number } from 'helpers/formatNumber';
import { formatPrice } from 'helpers/formatPrice';

export const formatApr = (data: BN): string => {
  const data2BN = bigNumber2Number(data, 1e6);
  const bn2Percent = new BigNumber(data2BN).toString();
  return formatPrice(bn2Percent);
};

export const formatAprV3 = (data: BN): string => {
  const data2BN = bigNumber2Number(data, 1e6);
  return new BigNumber(data2BN).integerValue(BigNumber.ROUND_DOWN).toString();
};
