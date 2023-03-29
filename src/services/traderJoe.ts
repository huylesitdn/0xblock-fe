import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tokenData: [],
  pairData: { reserve0: 0 },
};

const traderJoeSlide = createSlice({
  name: 'traderJoe',
  initialState,
  reducers: {
    setTokenData: (state, action) => {
      if (action.payload) {
        state.tokenData = action.payload;
        return;
      }
      state.tokenData = [];
    },
    setPairData: (state, action) => {
      if (action.payload) {
        state.pairData.reserve0 = action.payload;
        return;
      }
      state.pairData.reserve0 = 0;
    },
  },
});

export const { setTokenData, setPairData } = traderJoeSlide.actions;
const { reducer: traderJoeReducer } = traderJoeSlide;
export default traderJoeReducer;
