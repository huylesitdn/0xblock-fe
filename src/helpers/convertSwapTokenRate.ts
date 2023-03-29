import BigNumber from 'bignumber.js';

export const convertSwapTokenRate = (data: string[]) => {
  if (data[2]) {
    return new BigNumber(data[0]).div(new BigNumber(data[2])).toNumber();
  } else return new BigNumber(data[0]).div(new BigNumber(data[1])).toNumber();
};
