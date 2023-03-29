import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IAccount = {
  address: string;
};

const initialState = {
  account: <IAccount | undefined>{},
  isLogin: false,
  nativeBalance: '',
  zeroXBlockBalance: '',
  isOpenSelectWalletNodal: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<IAccount | undefined>) => {
      state.account = action.payload;
    },
    unSetAccount: (state) => {
      state.account = undefined;
    },
    setLogin: (state) => {
      state.isLogin = true;
    },
    unSetLogin: (state) => {
      state.isLogin = false;
    },
    setNativeBalance: (state, action) => {
      state.nativeBalance = action.payload;
    },
    unSetNativeBalance: (state) => {
      state.nativeBalance = '';
    },
    setZeroXBlockBalance: (state, action) => {
      state.zeroXBlockBalance = action.payload;
    },
    unSetZeroXBlockBalance: (state) => {
      state.zeroXBlockBalance = '';
    },
    setIsOpenSelectWalletModal: (state, action) => {
      state.isOpenSelectWalletNodal = action.payload;
    },
  },
});

export const {
  setAccount,
  unSetAccount,
  setLogin,
  unSetLogin,
  setNativeBalance,
  setZeroXBlockBalance,
  unSetNativeBalance,
  unSetZeroXBlockBalance,
  setIsOpenSelectWalletModal,
} = accountSlice.actions;

const { reducer: accountReducer } = accountSlice;

export default accountReducer;
