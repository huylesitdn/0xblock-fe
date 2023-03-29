import { Web3Provider } from '@ethersproject/providers';
import { Button, ButtonProps, Link, LinkProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import metamaskImg from 'assets/images/metamask-icon.svg';
import walletConnectImg from 'assets/images/walletConnect-icon.svg';
import WalletButton from 'components/Base/WalletButton';
import { injected, walletConnect } from 'connectors';
import { addEthereumChain, isMetaMaskInstalled, onClickConnect } from 'helpers';
import useFetchRewardAmount from 'hooks/useFetchRewardAmount';
import useMobileChangeAccountMetamask from 'hooks/useMobileChangeAccountMetamask';
import { useToast } from 'hooks/useToast';
import { useWindowSize } from 'hooks/useWindowSize';
import { errorMessage } from 'messages/errorMessages';
import { successMessage } from 'messages/successMessages';
import React, { useEffect, useState } from 'react';
import { setAccount, setIsOpenSelectWalletModal, setLogin, unSetAccount, unSetLogin } from 'services/account';
import { authenticateUser, getToken, unAuthenticateUser } from 'services/auth';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { ConnectWalletModal } from '../ConnectWalletModal';

interface Props {
  name?: string;
}

export enum WalletId {
  Metamask = 'metamask',
  WalletConnect = 'walletConnect',
}
const ButtonConnect = styled(Button)<ButtonProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  textDecoration: 'none',
  borderRadius: '14px',
  padding: '12px 20px',
  textTransform: 'unset',
  fontSize: '14px',
  lineHeight: '21px',
  fontWeight: 'bold',
  color: theme.palette.primary[theme.palette.mode],
  border: `1px solid ${theme.palette.primary[theme.palette.mode]}`,

  '&:hover': {
    color: theme.palette.primary[theme.palette.mode],
    border: `1px solid ${theme.palette.primary[theme.palette.mode]}`,
    opacity: 0.7,
  },
}));

const ButtonWallet = styled(Button)<ButtonProps>(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '14px',
  textTransform: 'capitalize',
  boxShadow: 'none',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',
  color: 'white',

  '&:hover': {
    opacity: 0.7,
    boxShadow: 'none',
    background: theme.palette.primary.main,
  },
}));

const LinkToMetamask = styled(Link)<LinkProps>(() => ({
  textDecoration: 'none',
  display: 'block',
  textAlign: 'center',
  padding: '10px',
  background: 'linear-gradient(129.07deg, #7FB2FE 3.5%, #879FFF 115.01%), #FFFFFF',
  color: 'white',
  borderRadius: '10px',
}));

const MessageMetamaskNotInstall = styled('p')(() => ({
  textAlign: 'center',
  margin: '5px 0',
}));

const CustomToastWithLink = () => (
  <div>
    <MessageMetamaskNotInstall>{errorMessage.META_MASK_DONT_INSTALLED.message}</MessageMetamaskNotInstall>
    <LinkToMetamask href="https://metamask.io" target={'_blank'}>
      {"Go to MetaMask's website"}
    </LinkToMetamask>
  </div>
);

const ConnectWallet: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const [width] = useWindowSize();
  const { active, account, activate, deactivate, error, chainId, connector } = useWeb3React<Web3Provider>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingTo, setConnectingTo] = useState<WalletId>();
  const [connectError, setConnectError] = useState(false);

  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;

  const isOpenSelectWalletNodal = useAppSelector((state) => state.user.isOpenSelectWalletNodal);
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const { createToast } = useToast();

  const handleResetModal = () => {
    setTimeout(() => {
      setConnectingTo(undefined);
      setConnectError(false);
      setIsConnecting(false);
    }, 500);
  };
  const handleResetConnector = (currentConnector: WalletConnectConnector) => {
    currentConnector.walletConnectProvider = undefined;
  };
  const handleConnectWallet = async (id: WalletId) => {
    try {
      setIsConnecting(true);
      setConnectingTo(id);
      if (id === 'metamask') {
        if (!isMetaMaskInstalled()) {
          setConnectError(true);
          createToast({
            message: CustomToastWithLink,
            type: 'error',
          });
          return;
        }
        await onClickConnect();
        await activate(injected);
        if (!getToken()) dispatch(setLogin());
        authenticateUser(Math.random().toString(36).substr(2, 10));
        dispatch(setIsOpenSelectWalletModal(false));
      } else if (id === 'walletConnect') {
        dispatch(setIsOpenSelectWalletModal(false));
        handleResetConnector(walletConnect);
        await activate(walletConnect, undefined, true);
        if (!getToken()) dispatch(setLogin());
        authenticateUser(Math.random().toString(36).substr(2, 10));
      }
      createToast({
        message: successMessage.META_MASK_CONNECT_SUCCESSFULLY.message,
        type: 'success',
        toastId: 2,
      });
      handleResetModal();
    } catch (ex: any) {
      dispatch(setIsOpenSelectWalletModal(true));
      setConnectError(true);
      if (ex.name === 'UnsupportedChainIdError' || ex.name === 't') {
        createToast({
          message: errorMessage.META_MASK_WRONG_NETWORK.message,
          type: 'error',
          toastId: 1,
        });
        return;
      }
      createToast({
        message: ex.message,
        type: 'error',
      });
    }
  };

  const handleLoginBtnClicked = async (): Promise<void> => {
    dispatch(setIsOpenSelectWalletModal(true));
  };

  const logout = async (): Promise<void> => {
    try {
      await deactivate();
      unAuthenticateUser();
      dispatch(unSetLogin());
      dispatch(unSetAccount());
      createToast({
        message: successMessage.META_MASK_DISCONNECT_SUCCESSFULLY.message,
        type: 'info',
      });
    } catch (ex: any) {
      createToast({
        message: ex.message,
        type: 'error',
      });
    } finally {
    }
  };

  const handleWrongNetWork = async (): Promise<void> => {
    try {
      if (connector instanceof WalletConnectConnector) {
        createToast({
          message: errorMessage.META_MASK_WRONG_NETWORK.message,
          type: 'error',
          toastId: 1,
        });
      } else {
        await addEthereumChain();
        await activate(injected);
      }
    } catch (ex: any) {
      createToast({
        message: ex.message,
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (account && isOpenSelectWalletNodal) {
      dispatch(setIsOpenSelectWalletModal(false));
      handleResetModal();
    }
  }, [account]);

  useEffect(() => {
    if (account && active && chainId && isLogin) {
      dispatch(setAccount({ address: account }));
      return;
    }
    dispatch(unSetAccount());
  }, [account, active, chainId, isLogin, currentUserAddress]);

  useEffect(() => {
    if (getToken()) {
      dispatch(setLogin());
      return;
    }
    dispatch(unSetLogin());
  }, [getToken()]);

  useEffect(() => {
    if (error?.name === 'UnsupportedChainIdError' || error?.name === 't') {
      createToast({
        message: errorMessage.META_MASK_WRONG_NETWORK.message,
        type: 'error',
        toastId: 1,
      });
      return;
    }
  }, [error?.name]);

  useFetchRewardAmount();
  useMobileChangeAccountMetamask();

  return (
    <>
      {width < 900 ? (
        <div>
          {!(active && isLogin) && (
            <div>
              {isUnsupportedChainIdError && !chainId ? (
                <WalletButton onChange={handleWrongNetWork} mode={'login'} />
              ) : (
                <WalletButton onChange={handleLoginBtnClicked} mode={'login'} />
              )}
            </div>
          )}
          {active && isLogin && (
            <div>
              <WalletButton onChange={logout} mode={'logout'} />
            </div>
          )}
        </div>
      ) : (
        <div>
          {!(active && isLogin) && (
            <div>
              {isUnsupportedChainIdError && !chainId ? (
                <ButtonConnect variant="outlined" color="primary" onClick={handleWrongNetWork}>
                  Wrong network
                </ButtonConnect>
              ) : (
                <ButtonConnect variant="outlined" color="primary" onClick={handleLoginBtnClicked}>
                  Connect Wallet
                </ButtonConnect>
              )}
            </div>
          )}
          {active && isLogin && (
            <div>
              <ButtonWallet variant="contained" color="primary" onClick={logout}>
                Disconnect Wallet
              </ButtonWallet>
            </div>
          )}
        </div>
      )}
      <ConnectWalletModal
        data={[
          {
            id: WalletId.Metamask,
            name: 'MetaMask',
            img: metamaskImg,
            content: 'Connect to your MetaMask Wallet',
            handleConnectWallet,
          },
          {
            id: WalletId.WalletConnect,
            name: 'WalletConnect',
            img: walletConnectImg,
            content: 'Scan with WalletConnect to connect',
            handleConnectWallet,
          },
        ]}
        onClose={() => {
          dispatch(setIsOpenSelectWalletModal(false));
          handleResetModal();
        }}
        open={isOpenSelectWalletNodal}
        isConnecting={isConnecting}
        onClickBackBtn={() => {
          setIsConnecting(false);
          setConnectError(false);
          setConnectingTo(undefined);
        }}
        connectingTo={connectingTo}
        isError={connectError}
      />
    </>
  );
};

export default ConnectWallet;
