import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apy: { square: '', cube: '', tesseract: '' },
  price: { square: 0, cube: 0, tesseract: 0 },
  total: { square: 0, cube: 0, tesseract: 0 },
  nodes: 0,
  dataMyContracts: [],
  dataRewardAmount: 0,
  isCreatingSquareContracts: false,
  isCreatingCubeContracts: false,
  isCreatingTesseractContracts: false,
  isClaimingReward: false,
  insuffBalance: false,
  isLimitOwnedNodes: false,
  isCloseMintContractModal: false,
  isOverMaxMintNodes: false,
  tokenDistribution: { developmentFee: 0, liquidityPoolFee: 0, rewardsFee: 0, treasuryFee: 0, cashOutFee: 0 },
};

const dataContractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setApy: (state, action) => {
      state.apy = action.payload;
    },
    unSetApy: (state) => {
      state.apy = { square: '', cube: '', tesseract: '' };
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    unSetPrice: (state) => {
      state.price = { square: 0, cube: 0, tesseract: 0 };
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    unSetTotal: (state) => {
      state.total = { square: 0, cube: 0, tesseract: 0 };
    },
    unSetNodes: (state) => {
      state.nodes = 0;
    },
    setDataMyContracts: (state, action) => {
      state.dataMyContracts = action.payload;
    },
    unSetDataMyContracts: (state) => {
      state.dataMyContracts = [];
    },
    setRewardAmount: (state, action) => {
      state.dataRewardAmount = action.payload;
    },
    unSetRewardAmount: (state) => {
      state.dataRewardAmount = 0;
    },
    setIsCreatingNodes: (state, action) => {
      if (action.payload.type === 'square') {
        state.isCreatingSquareContracts = true;
      } else if (action.payload.type === 'cube') {
        state.isCreatingCubeContracts = true;
      } else if (action.payload.type === 'tesseract') {
        state.isCreatingTesseractContracts = true;
      }
    },
    unSetIsCreatingNodes: (state) => {
      state.isCreatingSquareContracts = false;
      state.isCreatingCubeContracts = false;
      state.isCreatingTesseractContracts = false;
    },
    setIsClaimingReward: (state) => {
      state.isClaimingReward = true;
    },
    unSetIsClaimingReward: (state) => {
      state.isClaimingReward = false;
    },
    setInsuffBalance: (state) => {
      state.insuffBalance = true;
    },
    unSetInsuffBalance: (state) => {
      state.insuffBalance = false;
    },
    setIsLimitOwnedNodes: (state) => {
      state.isLimitOwnedNodes = true;
    },
    unSetIsLimitOwnedNodes: (state) => {
      state.isLimitOwnedNodes = false;
    },
    toggleIsCloseMintContractModal: (state, action) => {
      state.isCloseMintContractModal = action.payload;
    },
    setIsOverMaxMintNodes: (state, action) => {
      state.isOverMaxMintNodes = action.payload;
    },
    setTokenDistribution: (state, action) => {
      state.tokenDistribution = action.payload;
    },
    unSetTokenDistribution: (state) => {
      state.tokenDistribution = {
        developmentFee: 0,
        liquidityPoolFee: 0,
        rewardsFee: 0,
        treasuryFee: 0,
        cashOutFee: 0,
      };
    },
  },
});

export const {
  setApy,
  unSetApy,
  setPrice,
  unSetPrice,
  setNodes,
  setTotal,
  unSetTotal,
  unSetNodes,
  setDataMyContracts,
  unSetDataMyContracts,
  setRewardAmount,
  unSetRewardAmount,
  setIsCreatingNodes,
  unSetIsCreatingNodes,
  setIsClaimingReward,
  unSetIsClaimingReward,
  setInsuffBalance,
  unSetInsuffBalance,
  setIsLimitOwnedNodes,
  unSetIsLimitOwnedNodes,
  toggleIsCloseMintContractModal,
  setIsOverMaxMintNodes,
  setTokenDistribution,
  unSetTokenDistribution,
} = dataContractSlice.actions;
const { reducer: dataContractReducer } = dataContractSlice;
export default dataContractReducer;
