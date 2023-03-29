import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'utils/AxiosInstance';

const initialState = {
  error: false,
  loading: false,
  marketPriceData: [],
};

export const getMarketPriceData = createAsyncThunk('get/priceMarketData', async (params: object) => {
  return await axiosInstance.get(`${process.env.REACT_APP_COINGECKO_URL}/coins/markets`, {
    params,
  });
});

const coingekoSlice = createSlice({
  name: 'coingeko',
  initialState,
  reducers: {},
  extraReducers: {
    [getMarketPriceData.fulfilled.type]: (state, action) => {
      state.marketPriceData = action.payload.data;
    },
  },
});

const { reducer: coingekoReducer } = coingekoSlice;
export default coingekoReducer;
