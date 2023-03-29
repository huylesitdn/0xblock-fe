import AvaxImg from 'assets/images/avax-token.png';
import OxImg from 'assets/images/0x-token.png';
import USDCImg from 'assets/images/coin-usd.svg';
import { SwapTokenId } from 'hooks/swap';
export const TokensList = [
  {
    id: SwapTokenId.AVAX,
    logo: AvaxImg,
    name: 'AVAX',
    balance: 0,
    disabled: true,
    isNative: true,
  },
  {
    id: SwapTokenId.OXB,
    logo: OxImg,
    name: '0xB',
    balance: 0,
    disabled: false,
    isNative: false,
  },
  {
    id: SwapTokenId.USDC,
    logo: USDCImg,
    name: 'USDC',
    balance: 0,
    disabled: false,
    isNative: false,
  },
];

export const recentData = [
  {
    from: AvaxImg,
    to: OxImg,
    title: 'Swap 2 0xB for 0.06 AVAX',
    date: '10/2/2022',
    time: '10:21',
  },
  {
    from: OxImg,
    to: AvaxImg,
    title: 'Swap 0.06 AVAX for 2 0xB',
    date: '9/2/2022',
    time: '05:47',
  },
];
