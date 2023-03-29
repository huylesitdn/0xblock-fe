import { Percent } from '@traderjoe-xyz/sdk';

export const handleAddTradingFeeToSlippage = (slippage: Percent) => {
  return slippage.add(new Percent(String(0.1 * 1000), '100000'));
};
