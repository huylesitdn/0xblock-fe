import BigNumber from 'bignumber.js';
import { RewardRatioChart } from 'interfaces/RewardRatioChart';
import { truncateNumber } from 'helpers/formatPrice';

export const calcRewardRatio = (earn: string | number, index: number): string => {
  if (index === 0) return earn.toString();
  const earnedReward = new BigNumber(earn).times(0.85).toNumber();
  return truncateNumber(earnedReward, 3);
};

export const computedRewardRatioPerYear = (earn: string): Array<RewardRatioChart> => {
  const months = [1, 4, 7, 10];
  const rewardRatioCharts: Array<RewardRatioChart> = [];
  months.map((item, index) => {
    rewardRatioCharts.push({
      month: item,
      rewardRatio: calcRewardRatio(index === 0 ? earn : rewardRatioCharts[index - 1].rewardRatio, index),
    });
  });
  return [
    { month: 0, rewardRatio: rewardRatioCharts[0].rewardRatio } as RewardRatioChart,
    ...rewardRatioCharts,
    { month: 11, rewardRatio: rewardRatioCharts[3].rewardRatio } as RewardRatioChart,
  ];
};
