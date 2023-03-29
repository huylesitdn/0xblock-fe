import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [Number(process.env.REACT_APP_CHAIN_ID as string)],
});

export const getNetWorkRpcUrl = () => {
  return String(process.env.REACT_APP_RPC_URLS).includes('rinkeby') // check if network is rinkeby add infura Id
    ? String(process.env.REACT_APP_RPC_URLS) + String(process.env.REACT_APP_INFURA_ID)
    : String(process.env.REACT_APP_RPC_URLS);
};
export const walletConnect = new WalletConnectConnector({
  rpc: {
    [Number(process.env.REACT_APP_CHAIN_ID as string)]: getNetWorkRpcUrl(),
  },
  chainId: Number(process.env.REACT_APP_CHAIN_ID),
  qrcode: true,
  supportedChainIds: [Number(process.env.REACT_APP_CHAIN_ID)],
});
