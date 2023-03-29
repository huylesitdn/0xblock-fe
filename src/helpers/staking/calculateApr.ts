import BigNumber from 'bignumber.js';

interface Params {
  totalReward: string;
  oxbPrice: string;
  totalStaked: string;
  lpPrice: string;
  isOxbPool: boolean;
}

export const calculateApr = ({ totalReward, oxbPrice, totalStaked, lpPrice, isOxbPool }: Params) => {
  if (isOxbPool) {
    return new BigNumber(totalReward).div(new BigNumber(totalStaked)).multipliedBy(100).toString();
  } else {
    return new BigNumber(totalReward)
      .multipliedBy(new BigNumber(oxbPrice))
      .div(new BigNumber(totalStaked).multipliedBy(new BigNumber(lpPrice)))
      .multipliedBy(100)
      .toString();
  }
};
