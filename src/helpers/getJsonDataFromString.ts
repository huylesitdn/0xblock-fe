import { formatReward } from './formatReward';

const splitTheFirstValueFromString = (str: string, splitValue: string) => {
  const indexOfSplitValue = str.indexOf(splitValue);
  return [str.substring(0, indexOfSplitValue), str.substring(indexOfSplitValue + 1, str.length)];
};

const handleValueFromString = (str: string) => {
  const indexOfSecondQuote = str.lastIndexOf('"');
  const indexOfFirstQuote = str.lastIndexOf('"', str.lastIndexOf('"') - 1);
  return str.slice(indexOfFirstQuote + 1, indexOfSecondQuote);
};

export const getJsonDataFromString = (data: string) => {
  const arrayOfKeyValues = data.split(',\n');
  const { accumulatedValues } = arrayOfKeyValues.reduce(
    ({ accumulatedValues, currentObject }: any, currentValue) => {
      const valueArray = splitTheFirstValueFromString(currentValue, ':');
      const key = handleValueFromString(valueArray[0]);
      let value = handleValueFromString(valueArray[1]);
      if (key === 'value') {
        value = formatReward(handleValueFromString(valueArray[1]));
      }
      if (currentValue.includes('{')) {
        return {
          accumulatedValues,
          currentObject: {
            [key]: value,
          },
        };
      } else if (currentValue.includes('}')) {
        const newObjectValue = {
          ...currentObject,
          [key]: value,
        };
        return {
          accumulatedValues: [...accumulatedValues, newObjectValue],
          currentObject: {},
        };
      } else {
        return {
          accumulatedValues,
          currentObject: {
            ...currentObject,
            [key]: value,
          },
        };
      }
    },
    {
      accumulatedValues: [],
      currentObject: {},
    },
  );
  return accumulatedValues;
};
