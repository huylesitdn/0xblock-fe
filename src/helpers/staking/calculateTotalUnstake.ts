import BigNumber from 'bignumber.js';
import { calculateEarlyUnstakingFee } from './calculateEarlyUnstakingFee';

interface DataItem {
  stakedAmount: string;
  stakedTime: string;
  rewards: string;
  stakedTimeStamp: string;
}
const handleCalculateUnstakeFee = (records: DataItem[], stakingFeeTimes: string[]) => {
  return records.reduce((acc, item) => {
    return (
      acc + Number(calculateEarlyUnstakingFee(Number(item.stakedAmount), Number(item.stakedTimeStamp), stakingFeeTimes))
    );
  }, 0);
};

export const calculateTotalUnstake = (records: DataItem[], stakingFeeTimes: string[]) => {
  return (
    records.reduce((acc, item) => {
      return acc + Number(item.stakedAmount);
    }, 0) - handleCalculateUnstakeFee(records, stakingFeeTimes)
  );
};

export const calculateRemainAmountAfterUnstake = (records: DataItem[], allRecords: DataItem[]) => {
  const unstakeAmount = records.reduce((acc, item) => {
    return acc + Number(item.stakedAmount);
  }, 0);
  const totalAmount = allRecords.reduce((acc, item) => {
    return acc + Number(item.stakedAmount);
  }, 0);
  return new BigNumber(totalAmount).minus(new BigNumber(unstakeAmount)).toFixed(6);
};
