export const calculateToFixedNumber = (value: string, isHasEndingSymbol = true) => {
  const beforePeriodNumber = value.split('.')[0];
  if (beforePeriodNumber.length >= 3) {
    return isHasEndingSymbol ? 0 : 1;
  } else if (beforePeriodNumber.length === 2) {
    return isHasEndingSymbol ? 1 : 2;
  } else return isHasEndingSymbol ? 2 : 3;
};
