import { Icon } from 'interfaces/Icon';

const iconUrls: Icon[] = [
  {
    symbol: 'btc',
    url: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
  },
  {
    symbol: 'eth',
    url: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
  },
];

export const getIconUrlBySymbol = (symbol: string): string => {
  const icon = iconUrls.find((item) => item.symbol === symbol.toLowerCase());
  return icon ? icon.url : '';
};
