import { formatPrice, truncateNumber } from 'helpers/formatPrice';

export const formatAndTruncateNumber = (number: number, decimals = 3) => {
  const truncatedNumber = truncateNumber(number, decimals);
  return formatPrice(truncatedNumber, decimals, decimals);
};
