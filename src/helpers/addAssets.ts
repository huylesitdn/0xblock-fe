declare let window: any;

const imageUrl =
  'http://ec2-35-73-236-169.ap-northeast-1.compute.amazonaws.com' +
  '/static/media/coin-0xb.f6ea517608a7510e1bf5942429c201d7.svg';

export const addAssets = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: process.env.REACT_APP_CONTRACT_ADDRESS,
          symbol: process.env.REACT_APP_CONTRACT_SYMBOL,
          decimals: process.env.REACT_APP_CONTRACT_DECIMAL,
          image: imageUrl,
        },
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
