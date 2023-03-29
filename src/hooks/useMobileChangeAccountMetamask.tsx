import { useEffect } from 'react';

declare let window: any;

const useMobileChangeAccountMetamask = () => {
  const handle = async () => {
    window.location.reload();
  };
  useEffect(() => {
    if (window.ethereum) {
      if (window.innerWidth < 600) {
        window.ethereum.on('accountsChanged', handle);
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState == 'visible') {
            window.location.reload();
          } else {
            window.ethereum.removeListener('accountsChanged', handle);
          }
        });
      }
    }
  }, []);
};

export default useMobileChangeAccountMetamask;
