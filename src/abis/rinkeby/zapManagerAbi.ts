export const zapManagerAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'token', type: 'address' },
      { indexed: true, internalType: 'address', name: 'lpToken', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'bytes32', name: 'protocol', type: 'bytes32' },
    ],
    name: 'ZapIn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'lpToken', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'bytes32', name: 'protocol', type: 'bytes32' },
    ],
    name: 'ZapOut',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_usdtToken', type: 'address' },
      { internalType: 'address', name: '_wrappedNative', type: 'address' },
      { internalType: 'address', name: '_usdcToken', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'protocols',
    outputs: [
      { internalType: 'address', name: 'router', type: 'address' },
      { internalType: 'address', name: 'factory', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'bytes32', name: '_type', type: 'bytes32' },
      { internalType: 'address', name: '_factory', type: 'address' },
      { internalType: 'address', name: '_router', type: 'address' },
    ],
    name: 'setFactoryAndRouter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'token_', type: 'address' }],
    name: 'setToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdcToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdtToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wrappedNative',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_type', type: 'bytes32' },
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'address', name: '_receiver', type: 'address' },
    ],
    name: 'zapIn',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'protocolType', type: 'bytes32' },
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'address', name: 'receiver', type: 'address' },
        ],
        internalType: 'struct Zap.ZapInForm',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'zapInToken',
    outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_type', type: 'bytes32' },
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'address', name: '_receiver', type: 'address' },
    ],
    name: 'zapOut',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'zeroXBlockToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
