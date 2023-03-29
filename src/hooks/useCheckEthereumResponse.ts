import React, { useEffect } from 'react';
import { getToken } from 'services/auth';
import { useWindowSize } from './useWindowSize';

export const useCheckEthereumResponse = () => {
  const [ethereumOk, setEthereumOk] = React.useState(false);
  const { ethereum } = window as any;
  const [windowSize] = useWindowSize();

  const isMobile = () => {
    if (windowSize > 100 && windowSize < 600) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    // this is for fixing bug ethereum.request does not response on metamask
    if (ethereum && ethereum.isMetaMask && isMobile() && getToken()) {
      const waitingTime = 2000;
      const reloadPageTimeOut = setTimeout(() => {
        window.location.reload();
      }, waitingTime);

      ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
        clearTimeout(reloadPageTimeOut);
        setEthereumOk(true);
      });
      return () => {
        clearTimeout(reloadPageTimeOut);
      };
    } else if (windowSize > 0) {
      setEthereumOk(true);
    }
  }, [ethereum, windowSize, getToken()]);
  return {
    ethereumOk,
  };
};
