import { Route, Token } from '@traderjoe-xyz/sdk';
import { SwapTokenId } from 'hooks/swap';
import { PairsData, TokenData } from 'interfaces';

interface Params {
  isNativeTokenIn: boolean;
  isNativeTokenOut: boolean;
  pairsData: PairsData;
  tokenOut: SwapTokenId;
  tokenIn: SwapTokenId;
}
const tokenData: TokenData = {
  ['0xb' as SwapTokenId.OXB]: new Token(
    Number(process.env.REACT_APP_CHAIN_ID),
    String(process.env.REACT_APP_CONTRACT_ADDRESS),
    Number(process.env.REACT_APP_CONTRACT_DECIMAL),
    String(process.env.REACT_APP_CONTRACT_SYMBOL),
  ),
  ['avax' as SwapTokenId.AVAX]: new Token(
    Number(process.env.REACT_APP_CHAIN_ID),
    String(process.env.REACT_APP_NATIVE_TOKEN_ADDRESS),
    Number(process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS),
    String(process.env.REACT_APP_NATIVE_CURRENCY_SYMBOL),
  ),
  ['usdc' as SwapTokenId.USDC]: new Token(
    Number(process.env.REACT_APP_CHAIN_ID),
    String(process.env.REACT_APP_USDC_TOKEN_ADDRESS),
    Number(process.env.REACT_APP_USDC_DECIMALS),
    String(process.env.REACT_APP_USDC_SYMBOL),
  ),
  ['usdt' as SwapTokenId.USDT]: new Token(
    Number(process.env.REACT_APP_CHAIN_ID),
    String(process.env.REACT_APP_USDT_TOKEN_ADDRESS),
    Number(process.env.REACT_APP_USDT_DECIMALS),
    String(process.env.REACT_APP_USDT_SYMBOL),
  ),
  ['joelp' as SwapTokenId.JOELP]: new Token(
    Number(process.env.REACT_APP_CHAIN_ID),
    String(process.env.REACT_APP_JOE_LP_TOKEN_ADDRESS),
    Number(process.env.REACT_APP_JOE_LP_TOKEN_DECIMAL),
    String(process.env.REACT_APP_JOE_LP_TOKEN_SYMBOL),
  ),
};
export const getTraderJoeRouter = ({ isNativeTokenIn, isNativeTokenOut, pairsData, tokenOut, tokenIn }: Params) => {
  let tokenInRouter;
  let tokenOutRouter;
  if (isNativeTokenIn) {
    tokenInRouter = new Route([pairsData[tokenOut]!], tokenData[tokenIn], tokenData[tokenOut]);
    tokenOutRouter = new Route([pairsData[tokenOut]!], tokenData[tokenIn], tokenData[tokenOut]);
  } else if (isNativeTokenOut) {
    tokenInRouter = new Route([pairsData[tokenIn]!], tokenData[tokenIn], tokenData[tokenOut]);
    tokenOutRouter = new Route([pairsData[tokenIn]!], tokenData[tokenIn], tokenData[tokenOut]);
  } else {
    tokenInRouter = new Route([pairsData[tokenIn]!], tokenData[tokenIn], tokenData[SwapTokenId.AVAX]);
    tokenOutRouter = new Route([pairsData[tokenOut]!], tokenData[SwapTokenId.AVAX], tokenData[tokenOut]);
  }
  return {
    tokenInRouter,
    tokenOutRouter,
    tokenData,
  };
};
