import { BigNumber } from 'bignumber.js';
import { BigNumber as IBigNumber } from '@ethersproject/bignumber';

export const checkTransactionIsValid = (transaction: any, gaslimited: IBigNumber) => {
  const minimumLimitGas = new BigNumber(gaslimited._hex).toString();
  const transactionGasLimit = new BigNumber(transaction.gasLimit._hex).toString();
  if (!transaction.hash || Number(transactionGasLimit) < Number(minimumLimitGas)) {
    throw new Error('Oop! Something went wrong');
  }
};
