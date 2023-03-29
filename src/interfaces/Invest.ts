export interface BaseInvest {
  initial: string;
  // name: string;
  our_holdings: string;
  symbol: string;
}

export interface Invest extends BaseInvest {
  icon: string;
  token_price: number;
  avg_buy_price: number;
  current_investment: number;
}
