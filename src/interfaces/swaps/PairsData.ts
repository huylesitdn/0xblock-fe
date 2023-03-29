import { Pair } from '@traderjoe-xyz/sdk';
import { SwapTokenId } from 'hooks/swap';

export interface PairsData {
  [SwapTokenId.OXB]: Pair | null;
  [SwapTokenId.AVAX]: Pair | null;
  [SwapTokenId.USDC]: Pair | null;
  [SwapTokenId.USDT]: Pair | null;
  [SwapTokenId.JOELP]: Pair | null;
}
