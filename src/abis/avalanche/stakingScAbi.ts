export const stakingScAbi = [
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'uint256', name: '_totalDistribute', type: 'uint256' },
      { internalType: 'uint256', name: '_startTime', type: 'uint256' },
      { internalType: 'uint256', name: '_duration', type: 'uint256' },
    ],
    name: 'addPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'admin0xB',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint32', name: '_poolId', type: 'uint32' }],
    name: 'claimAllReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'uint8[]', name: '_indices', type: 'uint8[]' },
    ],
    name: 'claimReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'earlyWithdrawTaxPool',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint32', name: '_poolId', type: 'uint32' }],
    name: 'getAPR',
    outputs: [{ internalType: 'uint256', name: 'apr', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: '_onlyActive', type: 'bool' }],
    name: 'getJSONAllPoolsInfo',
    outputs: [{ internalType: 'string', name: 'res', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bool', name: '_onlyActive', type: 'bool' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'getJSONAllPoolsUser',
    outputs: [{ internalType: 'string', name: 'res', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint32', name: '_poolId', type: 'uint32' }],
    name: 'getJSONSinglePoolInfo',
    outputs: [{ internalType: 'string', name: 'res', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'getJSONSinglePoolUser',
    outputs: [{ internalType: 'string', name: 'res', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPoolsCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTaxLevels',
    outputs: [{ internalType: 'string', name: 'res', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: 'addr', type: 'address' },
    ],
    name: 'getUserPendingReward',
    outputs: [
      { internalType: 'string', name: 'res', type: 'string' },
      { internalType: 'uint256', name: 'ttl', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: 'addr', type: 'address' },
    ],
    name: 'getUserStakeAmounts',
    outputs: [
      { internalType: 'string', name: 'res', type: 'string' },
      { internalType: 'uint256', name: 'ttl', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: 'addr', type: 'address' },
    ],
    name: 'getUserTimestamps',
    outputs: [
      { internalType: 'string', name: 'res', type: 'string' },
      { internalType: 'uint256', name: 'minTs', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: 'addr', type: 'address' },
    ],
    name: 'getUserUnstakedAmount',
    outputs: [{ internalType: 'string', name: 'res', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'initialize', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
    name: 'isWhitelisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: 'addr', type: 'address' },
      { internalType: 'uint32', name: '_index', type: 'uint32' },
    ],
    name: 'pendingReward',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'pools',
    outputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'contract IERC20', name: 'stakingToken', type: 'address' },
      { internalType: 'uint256', name: 'stakedAmountInPool', type: 'uint256' },
      { internalType: 'uint256', name: 'totalDistribute', type: 'uint256' },
      { internalType: 'uint256', name: 'startTime', type: 'uint256' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
      { internalType: 'uint256', name: 'acc0xBPerShare', type: 'uint256' },
      { internalType: 'uint256', name: 'lastRewardTimestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[]', name: '_newLevels', type: 'uint256[]' }],
    name: 'setTaxLevels',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
    name: 'setToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_pool', type: 'address' }],
    name: 'setWithdrawTaxPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_timeout', type: 'uint256' }],
    name: 'setWithdrawTimeout',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_newLimit', type: 'uint256' }],
    name: 'setstakingRecordsLimitPerPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakingRecordsLimitPerPool',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: 'addr', type: 'address' },
      { internalType: 'uint32', name: '_index', type: 'uint32' },
    ],
    name: 'taxOfEntity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token0xBAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: 'addr', type: 'address' },
    ],
    name: 'totalStakeOfUser',
    outputs: [{ internalType: 'uint256', name: 'totalStake', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint32', name: '_poolId', type: 'uint32' }],
    name: 'updatePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '', type: 'uint32' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'userInfo',
    outputs: [{ internalType: 'uint8', name: 'size', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'uint8[]', name: '_entityIndices', type: 'uint8[]' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint32', name: '_poolId', type: 'uint32' }],
    name: 'withdrawAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'withdrawTaxLevel',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'withdrawTaxPortion',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawTimeout',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint32', name: '_poolId', type: 'uint32' },
      { internalType: 'address', name: 'addr', type: 'address' },
      { internalType: 'uint32', name: '_index', type: 'uint32' },
    ],
    name: 'withdrawable',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
