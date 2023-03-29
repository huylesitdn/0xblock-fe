import { getNetWorkRpcUrl } from 'connectors';
import { ethers } from 'ethers';
import { bigNumber2Number } from './formatNumber';

const provider = new ethers.providers.JsonRpcProvider(getNetWorkRpcUrl());

export const getTokenBalanceFromWalletAddress = async (
  contractAddress: string | undefined,
  abi: any,
  walletAddress: string,
  tokenDecimal?: string,
) => {
  try {
    if (contractAddress && abi && walletAddress) {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const balance = await contract.functions.balanceOf(walletAddress);
      const decimal = tokenDecimal ? tokenDecimal : await contract.functions.decimals.call({});
      return bigNumber2Number(balance[0], Number(`1e${decimal}`));
    }
  } catch (error) {
    return 0;
  }
  return 0;
};

export const getTokenAllowanceFromWalletAddress = async (
  contractAddress: string | undefined,
  abi: any,
  walletAddress: string,
  spender: string,
  tokenDecimal?: string,
) => {
  try {
    if (contractAddress && abi && walletAddress) {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const allowanceAmount = await contract.functions.allowance(walletAddress, spender);
      const decimal = tokenDecimal ? tokenDecimal : await contract.functions.decimals.call({});
      return bigNumber2Number(allowanceAmount[0], Number(`1e${decimal}`));
    }
  } catch (error) {
    return 0;
  }
  return 0;
};
