import { calculateToFixedNumber } from './calculateToFixedNumber';
import { formatBigNumber } from './formatBigNumber';
import { truncateNumber } from './formatPrice';

const convertLessThanThreeNumberValue = (value: string) => {
  if (value.length === 3) {
    return value + '.0';
  } else if (value.length === 2) {
    return value + '.00';
  }
  return value + '.000';
};

export const formatReward = (value: string, isAbbreviated = true) => {
  if (value === 'null' || value === 'undefined') {
    return '0';
  }
  const beforePeriodNumber = value.split('.')[0];
  const afterPeriodNumber = value.split('.')[1];
  if (beforePeriodNumber.length > 3) {
    return `${formatBigNumber(Number(beforePeriodNumber), isAbbreviated, false)} `;
  } else if (beforePeriodNumber.length <= 3 && !afterPeriodNumber) {
    return convertLessThanThreeNumberValue(beforePeriodNumber);
  } else if (afterPeriodNumber) {
    return truncateNumber(Number(value), calculateToFixedNumber(value, false));
  }
  return beforePeriodNumber;
};
