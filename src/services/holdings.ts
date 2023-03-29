import { createSlice } from '@reduxjs/toolkit';
import OxBCoin from 'assets/images/coin-0xb.svg';
import USDCoin from 'assets/images/coin-usd.svg';
import AVAXCoin from 'assets/images/avalanche-avax-logo.svg';

const DEFAULT_DATA = {
  treasury: [
    { name: '0xB', icon: OxBCoin, value: '0', amount: '0' },
    { name: 'AVAX', icon: AVAXCoin, value: '0', amount: '0' },
    { name: 'USDC', icon: USDCoin, value: '0', amount: '0' },
  ],
  liquidity: [
    { name: '0xB', icon: OxBCoin, value: '0', amount: '0' },
    { name: 'AVAX', icon: AVAXCoin, value: '0', amount: '0' },
    { name: 'USDC', icon: USDCoin, value: '0', amount: '0' },
  ],
  rewards: [
    { name: '0xB', icon: OxBCoin, value: '0', amount: '0' },
    { name: 'AVAX', icon: AVAXCoin, value: '0', amount: '0' },
    { name: 'USDC', icon: USDCoin, value: '0', amount: '0' },
  ],
  dev_marketing: [
    { name: '0xB', icon: OxBCoin, value: '0', amount: '0' },
    { name: 'AVAX', icon: AVAXCoin, value: '0', amount: '0' },
    { name: 'USDC', icon: USDCoin, value: '0', amount: '0' },
  ],
  reserve_rewards: [
    { name: '0xB', icon: OxBCoin, value: '0', amount: '0' },
    { name: 'AVAX', icon: AVAXCoin, value: '0', amount: '0' },
    { name: 'USDC', icon: USDCoin, value: '0', amount: '0' },
  ],
};

const initialState = {
  holdingsData: DEFAULT_DATA as any,
  loading: false,
};

const holdingsSlide = createSlice({
  name: 'holdings',
  initialState,
  reducers: {
    setHoldings: (state, action) => {
      if (action.payload) {
        state.holdingsData = action.payload;
        return;
      }
      state.holdingsData = DEFAULT_DATA;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setHoldings, setLoading } = holdingsSlide.actions;
const { reducer: holdingsReducer } = holdingsSlide;
export default holdingsReducer;
