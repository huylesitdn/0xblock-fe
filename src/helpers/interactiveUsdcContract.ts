import { contractUsdc, contractUsdcE } from 'utils/contractWithSigner';
import { BigNumber } from 'ethers';

export const getBalanceTokenUsdcEOf = async (adress: string): Promise<[BigNumber]> => {
  try {
    return contractUsdcE().functions.balanceOf(adress);
  } catch (e) {
    throw new Error('');
  }
};

export const getBalanceTokenUsdcOf = async (adress: string): Promise<[BigNumber]> => {
  try {
    return contractUsdc().functions.balanceOf(adress);
  } catch (e) {
    throw new Error('');
  }
};
