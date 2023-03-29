import { Token } from '@traderjoe-xyz/sdk';
import { SwapTokenId } from 'hooks/swap';

export interface TokenData {
  [SwapTokenId.AVAX]: Token;
  [SwapTokenId.OXB]: Token;
  [SwapTokenId.USDC]: Token;
  [SwapTokenId.USDT]: Token;
  [SwapTokenId.JOELP]: Token;
}
