import { calculateToFixedNumber } from './calculateToFixedNumber';

const roundingNumber = (number: number, fixedIndex: number) => {
  let cloneNumber = String(number);
  const regex = /\./;
  const isHasDot = regex.test(cloneNumber);
  const numberAfterRemoveDot = String(number).replace(regex, '');
  if (numberAfterRemoveDot.length < 3) {
    if (isHasDot) {
      if (numberAfterRemoveDot.length === 2) {
        cloneNumber = cloneNumber + '0';
      } else if (numberAfterRemoveDot.length === 1) {
        cloneNumber = cloneNumber + '00';
      }
    } else {
      if (numberAfterRemoveDot.length === 2) {
        cloneNumber = cloneNumber + '.0';
      } else if (numberAfterRemoveDot.length === 1) {
        cloneNumber = cloneNumber + '.00';
      }
    }
  }
  const stringValue = String(cloneNumber).split('.');
  if (stringValue[1]) {
    const numberAfterPeriod = stringValue[1].slice(0, fixedIndex);
    return stringValue[0] + '.' + numberAfterPeriod;
  }
  return String(number);
};

export const formatBigNumber = (value: number | null, isAbbreviated = true, removeEndingSymbol = false) => {
  const OneMillion = 1000000;
  const OneThousand = 1000;
  const oneBillion = 1000000000;
  const oneTrillion = 1000000000000;
  const millionNumberSuffixes = isAbbreviated ? 'M' : ' Million';
  const thousandNumberSuffixes = isAbbreviated ? 'K' : ' Thousand';
  const billionNumberSuffixes = isAbbreviated ? 'B' : ' Billion';
  const trillionNumberSuffixes = isAbbreviated ? 'T' : ' Trillion';
  const regex = /\.$/;
  if (value) {
    if (value >= oneTrillion) {
      const valueAfterDivide = value / oneTrillion;
      return (
        roundingNumber(valueAfterDivide, calculateToFixedNumber(String(valueAfterDivide))).replace(regex, '') +
        (removeEndingSymbol ? '' : trillionNumberSuffixes)
      );
    } else if (value >= oneBillion) {
      const valueAfterDivide = value / oneBillion;
      return (
        roundingNumber(valueAfterDivide, calculateToFixedNumber(String(valueAfterDivide))).replace(regex, '') +
        (removeEndingSymbol ? '' : billionNumberSuffixes)
      );
    } else if (value >= OneMillion) {
      const valueAfterDivide = value / OneMillion;
      return (
        roundingNumber(valueAfterDivide, calculateToFixedNumber(String(valueAfterDivide))).replace(regex, '') +
        (removeEndingSymbol ? '' : millionNumberSuffixes)
      );
    } else if (value >= OneThousand) {
      const valueAfterDivide = value / OneThousand;
      return (
        roundingNumber(valueAfterDivide, calculateToFixedNumber(String(valueAfterDivide))).replace(regex, '') +
        (removeEndingSymbol ? '' : thousandNumberSuffixes)
      );
    }
  }
  return value;
};
