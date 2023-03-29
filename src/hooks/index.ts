import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from 'connectors';
import { ethers } from 'ethers';
import { errorMessage } from 'messages/errorMessages';
import { getToken, unAuthenticateUser } from 'services/auth';
import { useToast } from './useToast';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
export const useEagerConnect = () => {
  const { activate, active, connector } = useWeb3React();
  const [tried, setTried] = useState(false);

  const handleAccountsChanged = (accounts: string[]) => {
    if (!accounts[0] && connector && !(connector instanceof WalletConnectConnector)) {
      unAuthenticateUser();
    }
  };

  useEffect(() => {
    const { ethereum } = window as any;
    // trying to active if the account is being connected on the metamask
    if (connector === undefined || connector instanceof InjectedConnector) {
      injected.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized && getToken()) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
          unAuthenticateUser();
        }
      });
    }
    // listeners
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
};

export const useInactiveListener = (suppress = false) => {
  const { active, error, activate, deactivate } = useWeb3React();
  const { createToast } = useToast();
  const validChainId = ethers.utils.hexlify(Number(process.env.REACT_APP_CHAIN_ID));

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum) {
      ethereum.removeAllListeners(['networkChanged']);
    }

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = async (chainId: string | number) => {
        if (chainId.toString() !== validChainId.toString()) {
          createToast({
            message: errorMessage.META_MASK_WRONG_NETWORK.message,
            type: 'error',
          });
          return;
        }
      };

      injected.on('Web3ReactDeactivate', unAuthenticateUser);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [active, error, suppress, activate, deactivate]);
};
