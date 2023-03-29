import { BigNumber } from 'bignumber.js';
import zipWith from 'lodash/zipWith';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
interface Params {
  dates: string[];
  stakedAmounts: string[];
  rewards: string[];
}

export const convertStakingData = ({ dates, stakedAmounts, rewards }: Params) => {
  if (dates[0] !== '') {
    return sortBy(
      zipWith(dates, stakedAmounts, rewards, (date, stakedAmount, reward) => {
        return {
          stakeDate: date,
          stakedAmount: stakedAmount ? new BigNumber(stakedAmount).div(1e18).toString() : stakedAmount,
          stakingTime: moment()
            .diff(moment(Number(date) * 1000), 'days')
            .toString(),
          reward: reward ? new BigNumber(reward).div(1e18).toString() : reward,
        };
      })
        .filter((item) => item.reward && item.stakeDate && item.stakedAmount)
        .map((item, index) => {
          return {
            ...item,
            id: String(index),
          };
        }),
      (item) => Number(item.stakeDate),
    );
  }
  return [];
};
