import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useEffect } from 'react';
import { unAuthenticateUser } from 'services/auth';

export const useWindowClose = () => {
  const { connector } = useWeb3React();
  useEffect(() => {
    const beforeunload = () => {
      if (connector && connector instanceof WalletConnectConnector) {
        unAuthenticateUser();
      }
    };

    window.addEventListener('beforeunload', beforeunload);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
    };
  }, [connector]);
};
