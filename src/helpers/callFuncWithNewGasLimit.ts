import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
interface Options {
  value?: any;
  from?: string;
  gasLimit?: string;
}

interface Params {
  contract: ethers.Contract;
  func: string;
  params: any[];
  options: Options;
}
export const callFuncWithNewGasLimit = async ({ contract, func, params, options }: Params) => {
  const increaseGasPercent = 20;
  const estimatedGas = await contract.estimateGas[func](...params, {
    ...options,
  });

  const increasedGasLimit = new BigNumber(estimatedGas._hex)
    .plus(new BigNumber(estimatedGas._hex).multipliedBy(increaseGasPercent).div(100))
    .toString()
    .split('.')[0];

  return await contract[func](...params, {
    ...options,
    gasLimit: increasedGasLimit,
  });
};
