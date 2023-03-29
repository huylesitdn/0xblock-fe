import isEqual from 'lodash/isEqual';

export const removeArrayItemByValue = <T>(array: T[], value: T) => {
  return array.filter((item) => {
    return !isEqual(item, value);
  });
};
