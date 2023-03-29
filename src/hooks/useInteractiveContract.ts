import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { BigNumber as BN } from 'bignumber.js';
import { contractType } from 'consts/typeReward';
import { getNetWorkRpcUrl } from 'connectors';
import { Multicall, ContractCallResults, ContractCallContext } from 'ethereum-multicall';
import { ChainId, Fetcher, Token, WAVAX } from '@traderjoe-xyz/sdk';
import {
  contsRewardManagerAbi as rewardRinkebyAbi,
  stakingScAbi as stakingManagerRinkebyAbi,
  usdcAbi as usdcRinkebyAbi,
  zapManagerAbi as zapManagerRinkebyAbi,
  zeroXBlockAbi as oxbRinkebyAbi,
} from 'abis/rinkeby';
import {
  contsRewardManagerAbi as rewardAvaxAbi,
  usdcAbi as usdcAvaxAbi,
  zeroXBlockAbi as oxbAvaxAbi,
  zapManagerAbi as zapManagerAvaxAbi,
  stakingScAbi as stakingManagerAvaxAbi,
} from 'abis/avalanche';
import values from 'lodash/values';
import { callFuncWithNewGasLimit } from 'helpers/callFuncWithNewGasLimit';
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '';
const rewardManagerAddress = process.env.REACT_APP_CONTS_REWARD_MANAGER || '';
const zapManagerAddress = process.env.REACT_APP_ZAP_MANAGER || '';
const stakingManagerAddress = process.env.REACT_APP_STAKING_MANAGER || '';

const OxbAbi = process.env.REACT_APP_NODE_ENV === 'dev' ? oxbRinkebyAbi : oxbAvaxAbi;
const UsdcAbi = process.env.REACT_APP_NODE_ENV === 'dev' ? usdcRinkebyAbi : usdcAvaxAbi;
const rewardManagerAbi = process.env.REACT_APP_NODE_ENV === 'dev' ? rewardRinkebyAbi : rewardAvaxAbi;
const zapManagerAbi = process.env.REACT_APP_NODE_ENV === 'dev' ? zapManagerRinkebyAbi : zapManagerAvaxAbi;
const stakingManagerAbi = process.env.REACT_APP_NODE_ENV === 'dev' ? stakingManagerRinkebyAbi : stakingManagerAvaxAbi;

const provider = new ethers.providers.JsonRpcProvider(getNetWorkRpcUrl());
const contractWithoutSigner = new ethers.Contract(contractAddress, OxbAbi, provider);
const rewardManagerContractWithoutSigner = new ethers.Contract(rewardManagerAddress, rewardManagerAbi, provider);
const zapManagerContractWithoutSigner = new ethers.Contract(zapManagerAddress, zapManagerAbi, provider);
const stakingContractWithoutSigner = new ethers.Contract(stakingManagerAddress, stakingManagerAbi, provider);

const OxbToken = new Token(
  Number(process.env.REACT_APP_CHAIN_ID) as ChainId,
  String(process.env.REACT_APP_CONTRACT_ADDRESS),
  Number(process.env.REACT_APP_CONTRACT_DECIMAL),
  String(process.env.REACT_APP_CONTRACT_SYMBOL),
);
const UsdcToken = new Token(
  Number(process.env.REACT_APP_CHAIN_ID) as ChainId,
  String(process.env.REACT_APP_USDC_TOKEN_ADDRESS),
  Number(process.env.REACT_APP_USDC_DECIMALS),
  String(process.env.REACT_APP_USDC_SYMBOL),
);
const UsdtToken = new Token(
  Number(process.env.REACT_APP_CHAIN_ID) as ChainId,
  String(process.env.REACT_APP_USDT_TOKEN_ADDRESS),
  Number(process.env.REACT_APP_USDT_DECIMALS),
  String(process.env.REACT_APP_USDT_SYMBOL),
);
interface MultiCallItem {
  reference: string;
  methodName: string;
  methodParameters: any[];
}

BN.config({
  EXPONENTIAL_AT: 100,
});

export interface MultiCallList {
  reference: string;
  contractAddress: string;
  abi: any;
  calls: MultiCallItem[];
}

export const useInteractiveContract = () => {
  const { library, account } = useWeb3React();

  const contractWithSigner =
    library && account
      ? new ethers.Contract(contractAddress, OxbAbi, library.getSigner(account))
      : contractWithoutSigner;

  const rewardManagerContractWithSigner =
    library && account
      ? new ethers.Contract(rewardManagerAddress, rewardManagerAbi, library.getSigner(account))
      : rewardManagerContractWithoutSigner;

  const zapManagerContractWithSigner =
    library && account
      ? new ethers.Contract(zapManagerAddress, zapManagerAbi, library.getSigner(account))
      : zapManagerContractWithoutSigner;

  const stakingManagerContractWithSigner =
    library && account
      ? new ethers.Contract(stakingManagerAddress, stakingManagerAbi, library.getSigner(account))
      : zapManagerContractWithoutSigner;

  const approveToken = async (tokenApproveAddress: string, spender: string) => {
    try {
      const contract = new ethers.Contract(tokenApproveAddress, UsdcAbi, library.getSigner(account));
      const gasLimit = await contract.estimateGas.approve(
        spender,
        new BN('2').pow(new BN('256').minus(new BN('1'))).toString(),
      );
      // increase gas limit to 20 %
      const increasedGasLimit = new BN(gasLimit._hex)
        .plus(new BN(gasLimit._hex).multipliedBy(20).div(100))
        .toString()
        .split('.')[0];
      return await contract.approve(spender, new BN('2').pow(new BN('256').minus(new BN('1'))).toString(), {
        gasLimit: increasedGasLimit,
      });
    } catch (err: any) {
      if (err.code === 4001) throw err;
      throw new Error('Oop! Something went wrong');
    }
  };

  const publicDistributeRewards = async (): Promise<void> => {
    try {
      return contractWithSigner.functions.publicDistributeRewards();
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const transferTokenTo = async (address: string, amount: string): Promise<void> => {
    try {
      return contractWithSigner.functions.transfer(address, amount);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const createMultipleNodesWithTokens = async (names: string[], cType: string): Promise<Record<string, any>> => {
    try {
      return await callFuncWithNewGasLimit({
        contract: contractWithSigner,
        func: 'mintConts',
        params: [names, cType.toString()],
        options: {},
      });
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const claimAllNodes = async () => {
    try {
      return contractWithSigner.functions.cashoutAll();
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const claimNodeByNode = async (nodeIndex: number) => {
    try {
      return contractWithSigner.functions.cashoutReward(nodeIndex);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  /** read contract **/
  const getBalanceTokenOf = async (address: string): Promise<[BigNumber]> => {
    try {
      return contractWithoutSigner.functions.balanceOf(address);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getBalanceNativeTokenOf = async (address: string): Promise<BigNumber> => {
    try {
      return provider.getBalance(address);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getRewardAPRAllNode = async (): Promise<any[]> => {
    try {
      const squareApy = rewardManagerContractWithoutSigner.functions.currentRewardAPRPerNewCont(contractType.square);
      const cubeApy = rewardManagerContractWithoutSigner.functions.currentRewardAPRPerNewCont(contractType.cube);
      const tesseractApy = rewardManagerContractWithoutSigner.functions.currentRewardAPRPerNewCont(
        contractType.tesseract,
      );

      return await Promise.all([squareApy, cubeApy, tesseractApy]);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getPriceAllNode = async (): Promise<any[]> => {
    try {
      const squarePrice = rewardManagerContractWithoutSigner.functions.contPrice(contractType.square);
      const cubePrice = rewardManagerContractWithoutSigner.functions.contPrice(contractType.cube);
      const tesseractPrice = rewardManagerContractWithoutSigner.functions.contPrice(contractType.tesseract);

      return await Promise.all([squarePrice, cubePrice, tesseractPrice]);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getTotalNodeByType = async (): Promise<any[]> => {
    try {
      const squareTotal = rewardManagerContractWithoutSigner.functions.totalContsPerContType(contractType.square);
      const cubeTotal = rewardManagerContractWithoutSigner.functions.totalContsPerContType(contractType.cube);
      const tesseractTotal = rewardManagerContractWithoutSigner.functions.totalContsPerContType(contractType.tesseract);

      return await Promise.all([squareTotal, cubeTotal, tesseractTotal]);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getNumberNodeOf = async (address: string): Promise<[BigNumber]> => {
    try {
      return contractWithoutSigner.functions.getNodeNumberOf(address);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getTimeCreatedOfNodes = async (): Promise<[string]> => {
    try {
      return rewardManagerContractWithSigner.functions._getContsCreationTime(account);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getNameOfNodes = async (): Promise<[string]> => {
    try {
      return rewardManagerContractWithSigner.functions._getContsNames(account);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getClaimedRewardOfUser = async (): Promise<{
    total: BigNumber;
    list: string;
  }> => {
    try {
      return await rewardManagerContractWithSigner.functions._getClaimedAmountOf(account);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getRewardOfNodes = async (): Promise<[string]> => {
    try {
      return rewardManagerContractWithSigner.functions._getContsRewardAvailable(account);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getTypeOfNodes = async (): Promise<[string]> => {
    try {
      return rewardManagerContractWithSigner.functions._getContsTypes(account);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getRewardAmount = async (): Promise<[BigNumber]> => {
    try {
      return rewardManagerContractWithSigner.functions._getRewardAmountOf(account);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getInitAPROfNodes = async (): Promise<[string]> => {
    try {
      return rewardManagerContractWithSigner.functions._getContsInitialAPR(account);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getNodesCurrentAPR = async (): Promise<[string]> => {
    try {
      return rewardManagerContractWithSigner.functions._getContsCurrentAPR(account);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getClaimPermit = async (): Promise<[boolean]> => {
    try {
      return contractWithoutSigner.functions.enableCashout.call({});
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getMintPermit = async (): Promise<[boolean]> => {
    try {
      return contractWithoutSigner.functions.enableMintConts.call({});
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getHoldingsWalletAddress = async (): Promise<string[][]> => {
    try {
      const devWallet = contractWithoutSigner.functions.developmentFundPool.call({});
      const treasuryWallet = contractWithoutSigner.functions.treasuryPool.call({});
      const rewardWallet = contractWithoutSigner.functions.rewardsPool.call({});
      const liquidityWallet = contractWithoutSigner.functions.liquidityPool.call({});

      return Promise.all([treasuryWallet, liquidityWallet, rewardWallet, devWallet]);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getUsdcTokenAddress = async (): Promise<string[]> => {
    try {
      return contractWithoutSigner.functions.usdcToken.call({});
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getPairAddress = async (): Promise<string> => {
    try {
      return contractWithoutSigner.functions.uniswapV2Pair.call({});
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const getTokenDistribution = async (): Promise<any[]> => {
    try {
      const developmentFee = contractWithoutSigner.functions.developmentFee.call({});
      const liquidityPoolFee = contractWithoutSigner.functions.liquidityPoolFee.call({});
      const rewardsFee = contractWithoutSigner.functions.rewardsFee.call({});
      const treasuryFee = contractWithoutSigner.functions.treasuryFee.call({});
      const cashOutFee = contractWithoutSigner.functions.cashoutFee.call({});

      return await Promise.all([developmentFee, liquidityPoolFee, rewardsFee, treasuryFee, cashOutFee]);
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const swap0xbToExactToken = async (token: string, amountOut: string, amountInMax: string, deadline: string) => {
    const _amountOut = amountOut.split('.')[0];
    const _amountInMax = amountInMax.split('.')[0];
    return await callFuncWithNewGasLimit({
      contract: contractWithSigner,
      func: 'swap0xBForExactToken',
      params: [token, _amountOut, _amountInMax, deadline],
      options: {},
    });
  };

  const swapExact0xbToToken = async (token: string, amountIn: string, amountOutMin: string, deadline: string) => {
    const _amountIn = amountIn.split('.')[0];
    const _amountOutMin = amountOutMin.split('.')[0];
    return await callFuncWithNewGasLimit({
      contract: contractWithSigner,
      func: 'swapExact0xBForToken',
      params: [token, _amountIn, _amountOutMin, deadline],
      options: {},
    });
  };

  const swapExactTokenTo0xb = async (token: string, amountIn: string, amountOutMin: string, deadline: string) => {
    const _amountIn = amountIn.split('.')[0];
    const _amountOutMin = amountOutMin.split('.')[0];
    return await callFuncWithNewGasLimit({
      contract: contractWithSigner,
      func: 'swapExactTokenFor0xB',
      params: [token, _amountIn, _amountOutMin, deadline],
      options: {},
    });
  };

  const swapTokenToExact0xb = async (token: string, amountOut: string, amountInMax: string, deadline: string) => {
    const _amountOut = amountOut.split('.')[0];
    const _amountInMax = amountInMax.split('.')[0];
    return await callFuncWithNewGasLimit({
      contract: contractWithSigner,
      func: 'swapTokenForExact0xB',
      params: [token, _amountOut, _amountInMax, deadline],
      options: {},
    });
  };

  const swapAVAXForExact0xB = async (
    payableAvaxAmount: string,
    amountOut: string,
    amountInMax: string,
    deadline: string,
  ) => {
    const _amountOut = amountOut.split('.')[0];
    const _amountInMax = amountInMax.split('.')[0];
    return await callFuncWithNewGasLimit({
      contract: contractWithSigner,
      func: 'swapAVAXForExact0xB',
      params: [_amountOut, _amountInMax, deadline],
      options: {
        value: ethers.utils.parseEther(payableAvaxAmount),
      },
    });
  };
  const swapExactAVAXFor0xB = async (payableAvaxAmount: string, amountOutMin: string, deadline: string) => {
    const _amountOutMin = amountOutMin.split('.')[0];
    return await callFuncWithNewGasLimit({
      contract: contractWithSigner,
      func: 'swapExactAVAXFor0xB',
      params: [_amountOutMin, deadline],
      options: {
        value: ethers.utils.parseEther(payableAvaxAmount),
      },
    });
  };

  const multipleCall = async (params: MultiCallList[]) => {
    const multiCall = new Multicall({ ethersProvider: provider, tryAggregate: true });
    const contractCallContext: ContractCallContext<{ extraContext: string; foo4: boolean }>[] = params.map(
      ({ reference, contractAddress, abi, calls }) => {
        return {
          reference,
          contractAddress,
          abi,
          calls,
        };
      },
    );
    const results: ContractCallResults = await multiCall.call(contractCallContext);
    return results.results;
  };

  const getPairsInfo = async () => {
    const WAVAX_OXB = Fetcher.fetchPairData(WAVAX[OxbToken.chainId], OxbToken, provider);
    const WAVAX_USDC = Fetcher.fetchPairData(WAVAX[OxbToken.chainId], UsdcToken, provider);
    const WAVAX_USDT = Fetcher.fetchPairData(WAVAX[OxbToken.chainId], UsdtToken, provider);
    return Promise.all([WAVAX_OXB, WAVAX_USDC, WAVAX_USDT]);
  };

  const getTotalSupply = async (): Promise<[BigNumber]> => {
    try {
      return contractWithoutSigner.functions.totalSupply();
    } catch (e) {
      throw new Error('Oop! Something went wrong');
    }
  };

  const handleZapInNativeToken = async (amountIn: string, receiver: string) => {
    return await callFuncWithNewGasLimit({
      contract: zapManagerContractWithSigner,
      func: 'zapIn',
      params: [process.env.REACT_APP_ZAP_TYPE, process.env.REACT_APP_JOE_LP_TOKEN_ADDRESS, receiver],
      options: {
        value: ethers.utils.parseEther(amountIn),
      },
    });
  };

  const handleZapInToken = async (tokenIn: string, amountIn: string, receiver: string, decimal: string) => {
    return await callFuncWithNewGasLimit({
      contract: zapManagerContractWithSigner,
      func: 'zapInToken',
      params: [
        {
          protocolType: process.env.REACT_APP_ZAP_TYPE,
          from: tokenIn,
          amount: new BN(amountIn).multipliedBy(Number(`1e${decimal}`)).toString(),
          to: process.env.REACT_APP_JOE_LP_TOKEN_ADDRESS,
          receiver,
        },
      ],
      options: {},
    });
  };

  const handleZapOut = async (tokenOut: string, amountIn: string, receiver: string, decimal: string) => {
    return await callFuncWithNewGasLimit({
      contract: zapManagerContractWithSigner,
      func: 'zapOut',
      params: [
        process.env.REACT_APP_ZAP_TYPE,
        process.env.REACT_APP_JOE_LP_TOKEN_ADDRESS,
        new BN(amountIn)
          .multipliedBy(Number(`1e${decimal}`))
          .minus('0')
          .toString(),
        tokenOut,
        receiver,
      ],
      options: {},
    });
  };

  const getPoolInfo = async (account: string, index: string) => {
    return {
      yourStakedAmounts: account ? await stakingContractWithoutSigner.getUserStakeAmounts(index, account) : '0',
      yourRewardAmounts: account ? await stakingContractWithoutSigner.getUserPendingReward(index, account) : '0',
      yourStakingTimes: account ? await stakingContractWithoutSigner.getUserTimestamps(index, account) : '0',
    };
  };

  const getJsonAllPool = async () => {
    const response = await stakingContractWithoutSigner.getJSONAllPoolsInfo(false);
    return values(JSON.parse(response)).filter((item) => item !== '');
  };

  const getJsonAllPoolByUser = async (account: string) => {
    const response = await stakingContractWithoutSigner.getJSONAllPoolsUser(false, account);
    return values(JSON.parse(response)).filter((item) => item !== '' && item.stakedAmount !== '0');
  };

  const claimRewards = async (poolId: string, indexes: string[]) => {
    return await stakingManagerContractWithSigner.claimReward(poolId, indexes);
  };

  const claimAllRewards = async (poolId: string) => {
    return await stakingManagerContractWithSigner.claimAllReward(poolId);
  };

  const stakeLp = async (poolId: string, amount: string) => {
    return await callFuncWithNewGasLimit({
      contract: stakingManagerContractWithSigner,
      func: 'deposit',
      params: [poolId, new BN(amount).multipliedBy(`1e${process.env.REACT_APP_JOE_LP_TOKEN_DECIMAL}`).toString()],
      options: {},
    });
  };

  const getTotalStakingPools = async () => {
    return await stakingContractWithoutSigner.getPoolsCount({});
  };

  const withDrawSelectedEntities = async (poolId: string, indexes: string[]) => {
    return await stakingManagerContractWithSigner.withdraw(poolId, indexes);
  };

  const withDrawAll = async (poolId: string) => {
    return await stakingManagerContractWithSigner.withdrawAll(poolId);
  };

  const getStakingRecordsLimit = async () => {
    return await stakingContractWithoutSigner.stakingRecordsLimitPerPool();
  };

  const getEarlyUnstakeFeeTime = async () => {
    return await stakingContractWithoutSigner.getTaxLevels();
  };

  return {
    approveToken,
    publicDistributeRewards,
    transferTokenTo,
    createMultipleNodesWithTokens,
    claimAllNodes,
    claimNodeByNode,
    getBalanceTokenOf,
    getBalanceNativeTokenOf,
    getRewardAPRAllNode,
    getPriceAllNode,
    getTotalNodeByType,
    getNumberNodeOf,
    getTimeCreatedOfNodes,
    getNameOfNodes,
    getRewardOfNodes,
    getTypeOfNodes,
    getRewardAmount,
    getInitAPROfNodes,
    getNodesCurrentAPR,
    getClaimPermit,
    getMintPermit,
    getHoldingsWalletAddress,
    getUsdcTokenAddress,
    getTokenDistribution,
    getPairAddress,
    multipleCall,
    swap0xbToExactToken,
    swapExact0xbToToken,
    getPairsInfo,
    swapExactTokenTo0xb,
    swapTokenToExact0xb,
    swapExactAVAXFor0xB,
    swapAVAXForExact0xB,
    getTotalSupply,
    handleZapInNativeToken,
    handleZapInToken,
    handleZapOut,
    getPoolInfo,
    claimRewards,
    stakeLp,
    getTotalStakingPools,
    withDrawSelectedEntities,
    getJsonAllPool,
    getJsonAllPoolByUser,
    withDrawAll,
    claimAllRewards,
    getStakingRecordsLimit,
    getEarlyUnstakeFeeTime,
    getClaimedRewardOfUser,
    contractWithSigner,
    provider,
  };
};
