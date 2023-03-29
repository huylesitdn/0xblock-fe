import { getInstanceEtherJs } from 'BaseEtherJs';
import { ethers } from 'ethers';
import { zeroXBlockAbi } from 'abis/rinkeby/zeroXBlockAbi';

import { getNetWorkRpcUrl } from 'connectors';
import { usdcAbi as usdcRinkebyAbi, usdcEAbi as usdcERinkebyAbi } from 'abis/rinkeby';
import { usdcAbi as usdcAvaxAbi, usdcEAbi as usdcEAvaxbyAbi } from 'abis/avalanche';

declare let window: any;

export const contractWithSigner = () => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '';
  const signer = window.ethereum && getInstanceEtherJs().getSigner();
  return new ethers.Contract(contractAddress, zeroXBlockAbi, signer);
};

export const contractUsdcE = () => {
  const provider = new ethers.providers.JsonRpcProvider(getNetWorkRpcUrl());
  const contractAddress = process.env.REACT_APP_USDC_E_CONTRACT_ADDRESS || '';
  return new ethers.Contract(
    contractAddress,
    process.env.REACT_APP_NODE_ENV === 'dev' ? usdcERinkebyAbi : usdcEAvaxbyAbi,
    provider,
  );
};

export const contractUsdc = () => {
  const provider = new ethers.providers.JsonRpcProvider(getNetWorkRpcUrl());
  const contractAddress = process.env.REACT_APP_USDC_TOKEN_ADDRESS || '';
  return new ethers.Contract(
    contractAddress,
    process.env.REACT_APP_NODE_ENV === 'dev' ? usdcRinkebyAbi : usdcAvaxAbi,
    provider,
  );
};
