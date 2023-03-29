import { ethers } from 'ethers';

declare let window: any;

const regex = /^0x0[0-9]$/;

export const addEthereumChain = async (externalProvider?: any) => {
  const { ethereum } = window;
  const provider = externalProvider || ethereum;
  //  with rinkeby network hexlify will return 0x04. it is wrong
  const hexlifyId = ethers.utils.hexlify(Number(process.env.REACT_APP_CHAIN_ID) || '');
  const chainId = regex.test(hexlifyId) ? hexlifyId.slice(0, 2) + hexlifyId[3] : hexlifyId;
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName: process.env.REACT_APP_CHAIN_NAME,
              rpcUrls: [process.env.REACT_APP_RPC_URLS],
              nativeCurrency: {
                name: process.env.REACT_APP_NATIVE_CURRENCY_NAME,
                decimals: 18,
                symbol: process.env.REACT_APP_NATIVE_CURRENCY_SYMBOL,
              },
              blockExplorerUrls: [process.env.REACT_APP_EXPLORER_URLS],
            },
          ],
        });
      } catch (addError: any) {
        throw new Error(addError.message);
      }
    }
  }
};
