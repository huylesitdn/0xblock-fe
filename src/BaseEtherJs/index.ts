import { ethers } from 'ethers';

declare let window: any;

export const getInstanceEtherJs = () => {
  try {
    return new ethers.providers.Web3Provider(window.ethereum);
  } catch {
    throw new Error('can not create new instance ether');
  }
};
