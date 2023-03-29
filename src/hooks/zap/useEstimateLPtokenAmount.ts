import BigNumber from 'bignumber.js';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import { SwapTokenId } from 'hooks/swap';
import { useLoadSwapData } from 'hooks/swap/useLoadSwapData';
import { LiquidityPoolData } from 'services/zap';

export const useEstimateLPTokenAmount = () => {
  const { loadEstimateToken } = useLoadSwapData();

  const calculateLpToken = (
    avaxReserve: string,
    oxbReserve: string,
    oxbAmount: string,
    avaxAmount: string,
    totalLpSupply: string,
  ) => {
    const estimateLpTokenByOxb = new BigNumber(oxbAmount)
      .multipliedBy(new BigNumber(totalLpSupply))
      .div(new BigNumber(oxbReserve))
      .toString();
    const estimateLpTokenByAvax = new BigNumber(avaxAmount)
      .multipliedBy(new BigNumber(totalLpSupply))
      .div(new BigNumber(avaxReserve))
      .toString();
    const oxbLargeThanAvax =
      new BigNumber(estimateLpTokenByOxb).toNumber() > new BigNumber(estimateLpTokenByAvax).toNumber();
    return formatForNumberLessThanCondition({
      value: oxbLargeThanAvax ? estimateLpTokenByAvax : estimateLpTokenByOxb,
      minValueCondition: '0.0000000001',
      addLessThanSymbol: false,
      callback: formatPercent,
      callBackParams: [10],
    });
  };
  const handleEstimateZapInLpTokenAmount = (
    tokenIn: SwapTokenId,
    amount: string,
    liquidityPoolInfo: LiquidityPoolData,
  ) => {
    const oxbInToken0 = liquidityPoolInfo.token0.symbol === '0xB';
    let amountAvax = '0';
    let amountOxb = '0';
    if (tokenIn === SwapTokenId.AVAX) {
      const halfAmount = new BigNumber(amount).div(2).toString();
      const { estimatedAmountToken } = loadEstimateToken({
        tokenIn,
        tokenOut: SwapTokenId.OXB,
        isExactInput: true,
        amount: halfAmount,
        isSubtractFee: false,
      });
      amountAvax = halfAmount;
      amountOxb = estimatedAmountToken !== '' ? estimatedAmountToken : '0';
    } else {
      const halfAmount = new BigNumber(amount).div(2).toString();
      const { estimatedAmountToken: estimateOxb } = loadEstimateToken({
        tokenIn,
        tokenOut: SwapTokenId.OXB,
        isExactInput: true,
        amount: halfAmount,
        isSubtractFee: false,
      });
      const { estimatedAmountToken: estimateAvax } = loadEstimateToken({
        tokenIn,
        tokenOut: SwapTokenId.AVAX,
        isExactInput: true,
        amount: halfAmount,
        isSubtractFee: false,
      });
      amountAvax = estimateAvax !== '' ? estimateAvax : '0';
      amountOxb = estimateOxb !== '' ? estimateOxb : '0';
    }
    return calculateLpToken(
      oxbInToken0 ? liquidityPoolInfo.reserve1 : liquidityPoolInfo.reserve0,
      oxbInToken0 ? liquidityPoolInfo.reserve0 : liquidityPoolInfo.reserve1,
      amountOxb,
      amountAvax,
      liquidityPoolInfo.totalSupply,
    );
  };

  const handleEstimateZapOutLpTokenAmount = (
    tokenOut: SwapTokenId,
    amount: string,
    liquidityPoolInfo: LiquidityPoolData,
  ) => {
    const oxbInToken0 = liquidityPoolInfo.token0.symbol === '0xB';
    const avaxReserve = oxbInToken0 ? liquidityPoolInfo.reserve1 : liquidityPoolInfo.reserve0;
    const oxbReserve = oxbInToken0 ? liquidityPoolInfo.reserve0 : liquidityPoolInfo.reserve1;
    let amountTokenSwapFromAvax = '0';
    let amountTokenSwapFromOxb = '0';
    const lpTokenToAvaxAmount = new BigNumber(amount)
      .div(liquidityPoolInfo.totalSupply)
      .multipliedBy(avaxReserve)
      .toString();
    const lpTokenToOxbAmount = new BigNumber(amount)
      .div(liquidityPoolInfo.totalSupply)
      .multipliedBy(oxbReserve)
      .toString();

    if (tokenOut !== SwapTokenId.AVAX) {
      const { estimatedAmountToken: _amountTokenSwapFromAvax } = loadEstimateToken({
        tokenIn: SwapTokenId.AVAX,
        tokenOut: tokenOut,
        isExactInput: true,
        amount: lpTokenToAvaxAmount,
        isSubtractFee: false,
      });
      amountTokenSwapFromAvax = _amountTokenSwapFromAvax;
    } else {
      amountTokenSwapFromAvax = lpTokenToAvaxAmount;
    }
    if (tokenOut !== SwapTokenId.OXB) {
      const { estimatedAmountToken: _amountTokenSwapFromOxb } = loadEstimateToken({
        tokenIn: SwapTokenId.OXB,
        tokenOut: tokenOut,
        isExactInput: true,
        amount: lpTokenToOxbAmount,
        isSubtractFee: false,
      });
      amountTokenSwapFromOxb = _amountTokenSwapFromOxb;
    } else {
      amountTokenSwapFromOxb = lpTokenToOxbAmount;
    }
    return formatForNumberLessThanCondition({
      value: new BigNumber(amountTokenSwapFromAvax).plus(new BigNumber(amountTokenSwapFromOxb)).toString(),
      minValueCondition: '0.0000000001',
      addLessThanSymbol: false,
      callback: formatPercent,
      callBackParams: [10],
    });
  };

  return {
    handleEstimateZapInLpTokenAmount,
    handleEstimateZapOutLpTokenAmount,
  };
};
