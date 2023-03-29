import BigNumber from 'bignumber.js';
import { REGEX_UNIT_NUMBER } from 'consts/regrex';

export const formatPrice = (price: string, maximumFractionDigits = 2, minimumFractionDigits = 2): string => {
  if (price) {
    return Number(price).toLocaleString('en-US', {
      maximumFractionDigits,
      minimumFractionDigits:
        maximumFractionDigits < minimumFractionDigits ? maximumFractionDigits : minimumFractionDigits,
    });
  }
  return Number('0').toLocaleString('en-US', {
    maximumFractionDigits,
    minimumFractionDigits:
      maximumFractionDigits < minimumFractionDigits ? maximumFractionDigits : minimumFractionDigits,
  });
};

export const formatNumberWithComas = (number: number): string => {
  const decimalPlaces = number.toString().split('.');
  decimalPlaces[0] = decimalPlaces[0].replace(REGEX_UNIT_NUMBER, ',');
  return decimalPlaces.join('.');
};

export const truncateNumber = (number: number, decimals: number): string => {
  const factor = Math.pow(10, decimals);
  return new BigNumber(number * factor).div(factor).toFixed(decimals, BigNumber.ROUND_DOWN);
};

export const formatPercent = (percent: string, maximumFractionDigits = 2, minimumFractionDigits = 0) => {
  return String(
    new BigNumber(percent).toNumber().toLocaleString('en-US', {
      maximumFractionDigits,
      minimumFractionDigits:
        maximumFractionDigits < minimumFractionDigits ? maximumFractionDigits : minimumFractionDigits,
    }),
  ).replaceAll(',', '');
};
