import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import OxImg from 'assets/images/coin-0xb.svg';
import AvaxImg from 'assets/images/avalanche-avax-logo.svg';
import USDCImg from 'assets/images/coin-usd.svg';
import USDTImg from 'assets/images/coin-usdt.svg';
import { SwapTokenId } from 'hooks/swap';
import { PairsData } from 'interfaces';
import { TokenItem } from 'pages/Swap';

const initialState = {
  tokenAddress: {
    ['0xb' as SwapTokenId.OXB]: process.env.REACT_APP_CONTRACT_ADDRESS!,
    ['avax' as SwapTokenId.AVAX]: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS!,
    ['usdc' as SwapTokenId.USDC]: process.env.REACT_APP_USDC_TOKEN_ADDRESS!,
    ['usdt' as SwapTokenId.USDT]: process.env.REACT_APP_USDT_TOKEN_ADDRESS!,
    ['joelp' as SwapTokenId.JOELP]: process.env.REACT_APP_JOE_LP_TOKEN_ADDRESS!,
  },
  pairsData: {
    ['0xb']: null,
    ['avax']: null,
    ['usdc']: null,
    ['usdt']: null,
  } as PairsData,
  recentTransactions: [],
  tokenList: [
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
  selectedName: 'from' as string | null,
  isInsufficientError: false,
  isLoadEstimateToken: false,
  isInsufficientLiquidityError: false,
  pairInfoLoaded: false,
};

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setTokenAddress: (state, action: PayloadAction<any>) => {
      state.tokenAddress = action.payload;
    },
    setPairData: (state, action: PayloadAction<any>) => {
      state.pairsData = action.payload;
    },
    handleDisableToken: (state, action: PayloadAction<any>) => {
      const newTokenList = state.tokenList.map((tokenItem) => {
        const foundedToken = action.payload.find((item: TokenItem) => item.id === tokenItem.id);
        if (foundedToken) {
          return {
            ...tokenItem,
            disabled: foundedToken.disabled,
          };
        }
        return tokenItem;
      });
      state.tokenList = newTokenList;
    },
    handleSetTokenBalances: (state, action: PayloadAction<any>) => {
      const newTokenList = state.tokenList.map((tokenItem) => {
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
      state.tokenList = newTokenList;
    },
    setRecentTransactions: (state, action: PayloadAction<any>) => {
      state.recentTransactions = action.payload;
    },
    setSelectedName: (state, action: PayloadAction<string | null>) => {
      state.selectedName = action.payload;
    },
    setIsInsufficientError: (state, action: PayloadAction<boolean>) => {
      state.isInsufficientError = action.payload;
    },
    setIsInsufficientLiquidityError: (state, action: PayloadAction<boolean>) => {
      state.isInsufficientLiquidityError = action.payload;
    },
    setIsLoadEstimateToken: (state, action: PayloadAction<boolean>) => {
      state.isLoadEstimateToken = action.payload;
    },
    setPairInfoLoaded: (state, action: PayloadAction<any>) => {
      state.pairInfoLoaded = action.payload;
    },
  },
});

export const {
  setTokenAddress,
  setPairData,
  handleDisableToken,
  handleSetTokenBalances,
  setRecentTransactions,
  setSelectedName,
  setIsInsufficientError,
  setIsLoadEstimateToken,
  setIsInsufficientLiquidityError,
  setPairInfoLoaded,
} = swapSlice.actions;

const { reducer: swapReducer } = swapSlice;

export default swapReducer;
