export interface MineContract {
  mintDate: string;
  name: string;
  type: string;
  initial: string;
  current: string;
  rewards: string;
}

export interface ContractResponse {
  mintDates: Array<string>;
  names: Array<string>;
  types: Array<string>;
  initZeroXBlockPerDays: Array<string>;
  currentZeroXBlockPerDays: Array<string>;
  rewards: Array<string>;
  claimedRewards: string[];
}
