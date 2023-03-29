import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenItem } from 'pages/Zap';
import OxImg from 'assets/images/coin-0xb.svg';
import AvaxImg from 'assets/images/avalanche-avax-logo.svg';
import USDCImg from 'assets/images/coin-usd.svg';
import USDTImg from 'assets/images/coin-usdt.svg';
import { SwapTokenId } from 'hooks/swap';
export interface LiquidityPoolData {
  reserve0: string;
  reserve1: string;
  token0: {
    symbol: string;
  };
  token1: {
    symbol: string;
  };
  totalSupply: string;
}

interface States {
  liquidityPoolData: LiquidityPoolData;
  isLiquidityPoolLoaded: boolean;
  zapTokenList: TokenItem[];
  ZapSelectedName: string | null;
}

const initialState: States = {
  liquidityPoolData: {
    reserve0: '0',
    reserve1: '0',
    token0: {
      symbol: '',
    },
    token1: {
      symbol: '',
    },
    totalSupply: '0',
  },
  isLiquidityPoolLoaded: false,
  zapTokenList: [
    {
      id: 'avax' as SwapTokenId.AVAX,
      logo: AvaxImg,
      name: 'AVAX',
      balance: '0',
      allowanceBalance: '1000000000000000000',
      disabled: false,
      isNative: true,
      decimal: process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || '18',
      address: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS || '',
    },
    {
      id: '0xb' as SwapTokenId.OXB,
      logo: OxImg,
      name: '0xB',
      balance: '0',
      allowanceBalance: '1000000000000000000',
      disabled: false,
      isNative: false,
      decimal: process.env.REACT_APP_CONTRACT_DECIMAL || '18',
      address: process.env.REACT_APP_CONTRACT_ADDRESS || '',
    },
    {
      id: 'usdc' as SwapTokenId.USDC,
      logo: USDCImg,
      name: 'USDC',
      balance: '0',
      allowanceBalance: '0',
      disabled: false,
      isNative: false,
      decimal: process.env.REACT_APP_USDC_DECIMALS || '6',
      address: process.env.REACT_APP_USDC_TOKEN_ADDRESS || '',
    },
    {
      id: 'usdt' as SwapTokenId.USDT,
      logo: USDTImg,
      name: 'USDT',
      balance: '0',
      allowanceBalance: '0',
      disabled: false,
      isNative: false,
      decimal: process.env.REACT_APP_USDT_DECIMALS || '6',
      address: process.env.REACT_APP_USDT_TOKEN_ADDRESS || '',
    },
    {
      id: 'joelp' as SwapTokenId.JOELP,
      logo: '',
      name: 'LP',
      balance: '0',
      allowanceBalance: '0',
      disabled: false,
      isNative: false,
      decimal: process.env.REACT_APP_JOE_LP_TOKEN_DECIMAL || '6',
      address: process.env.REACT_APP_JOE_LP_TOKEN_ADDRESS || '',
    },
  ],
  ZapSelectedName: 'from',
};

export const zapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    handleSetLiquidityPoolData: (state, action) => {
      state.liquidityPoolData = action.payload;
    },
    handleSetIsLiquidityPoolLoaded: (state, action) => {
      state.isLiquidityPoolLoaded = action.payload;
    },
    handleDisableZapToken: (state, action: PayloadAction<any>) => {
      const newTokenList = state.zapTokenList.map((tokenItem) => {
        const foundedToken = action.payload.find((item: TokenItem) => item.id === tokenItem.id);
        if (foundedToken) {
          return {
            ...tokenItem,
            disabled: foundedToken.disabled,
          };
        }
        return tokenItem;
      });
      state.zapTokenList = newTokenList;
    },
    handleSetZapTokenBalances: (state, action: PayloadAction<any>) => {
      const newTokenList = state.zapTokenList.map((tokenItem) => {
        const foundedToken = action.payload.find((item: TokenItem) => item.id === tokenItem.id);
        if (foundedToken) {
          return {
            ...tokenItem,
            balance: foundedToken.balance,
            allowanceBalance: foundedToken.allowanceBalance,
          };
        }
        return tokenItem;
      });
      state.zapTokenList = newTokenList;
    },
    setZapSelectedName: (state, action: PayloadAction<string | null>) => {
      state.ZapSelectedName = action.payload;
    },
  },
});

export const {
  handleSetLiquidityPoolData,
  handleSetIsLiquidityPoolLoaded,
  handleSetZapTokenBalances,
  setZapSelectedName,
  handleDisableZapToken,
} = zapSlice.actions;

const { reducer: zapReducer } = zapSlice;

export default zapReducer;
