import BigNumber from 'bignumber.js';
import { formatPrice, truncateNumber } from 'helpers/formatPrice';

const FACTOR = 36500;
export const computeEarnedTokenPerDay = (price: number, apy: string) => {
  if (price && apy) {
    const earnedToken = new BigNumber(price).times(apy).div(FACTOR).toNumber();
    const truncatedNumber = truncateNumber(earnedToken, 3);
    return formatPrice(truncatedNumber, 3, 3);
  }
  return '0.00';
};
