import BigNumber from 'bignumber.js';
import moment from 'moment';

export const calculateEarlyUnstakingFee = (totalStakedValue: number, startTime: number, stakingFeeTimes: string[]) => {
  const before30DaysFee = 5;
  const before60DaysFee = 2.5;
  const currentTime = moment().unix();
  const timeDiff = currentTime - startTime;
  const level1TaxTime = Number(stakingFeeTimes[2]);
  const level2TaxTime = Number(stakingFeeTimes[3]);
  let fee = '0';
  if (timeDiff < level1TaxTime) {
    fee = new BigNumber(totalStakedValue).multipliedBy(before30DaysFee).div(100).toString();
  } else if (timeDiff >= level1TaxTime && timeDiff < level2TaxTime) {
    fee = new BigNumber(totalStakedValue).multipliedBy(before60DaysFee).div(100).toString();
  }
  return fee;
};
