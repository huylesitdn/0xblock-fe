import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogContentProps,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  IconButton,
  IconButtonProps,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import darkBlackArrowIcon from 'assets/images/ic-black-back-arrow.svg';
import darkCloseIcon from 'assets/images/ic-close-dark-no-border.svg';
import whiteCloseIcon from 'assets/images/ic-close-white-no-border.svg';
import whiteBlackArrowIcon from 'assets/images/ic-white-back-arrow.svg';
import { WalletId } from 'components/ConnectWallet/ConnectWallet';
import React from 'react';

interface WalletItem {
  id: WalletId;
  img: string;
  name: string;
  content: string;
  handleConnectWallet: (id: WalletId) => Promise<void>;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: WalletItem[];
  isConnecting?: boolean;
  connectingTo?: string;
  isError?: boolean;
  onClickBackBtn: () => void;
}

const BootstrapDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '100%',
    maxWidth: '437px',
    minWidth: 'fit-content',
    background: theme.palette.mode === 'dark' ? '#171717' : '#ffffff',
    borderRadius: '20px',
    boxShadow: '0px 4px 67px rgba(0, 0, 0, 0.02)',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiPaper-root': {
      maxWidth: '329px',
      borderRadius: '16px',
    },
  },
}));

const WalletName = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  textTransform: 'capitalize',
  textAlign: 'center',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#565656',
  fontWeight: 500,
  fontSize: '18px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
}));

const ImageBox = styled(Box)<BoxProps>(() => ({
  width: 'fit-content',
  height: 'fit-content',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const WalletItem = styled(Box)<
  BoxProps & {
    isError?: boolean;
  }
>(({ theme, isError = false }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: theme.palette.mode === 'dark' ? '#171717' : '#FFFFFF',
  border: isError
    ? '1.5px solid #FF7474'
    : theme.palette.mode === 'dark'
    ? '1.5px solid rgba(201, 201, 201, 0.1)'
    : '1.5px solid rgba(47, 44, 103, 0.1)',

  padding: '25px',
  boxSizing: 'border-box',
  marginBottom: '30px',
  borderRadius: '12px',
  height: '83px',
  cursor: 'pointer',
  ['&:hover']: {
    border: isError ? '1.5px solid #FF7474' : '1.5px solid #0052FF',
  },
}));

const DialogBottomTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  textTransform: 'capitalize',
  textAlign: 'center',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#3A3A3A',
  fontWeight: 500,
  fontSize: '16px',
  paddingBottom: '11px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
}));
const DialogBottomContent = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  textAlign: 'center',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#8E93A0',
  fontWeight: 400,
  fontSize: '12px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '11px',
  },
}));

const Text = styled(Box)<BoxProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: '500',
  fontSize: '16px',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#565656',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
}));

const Header = styled(DialogTitle)<DialogTitleProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '28px 28px 8px 28px',
  justifyContent: 'space-between',
}));
const CloseIcon = styled(IconButton)<
  IconButtonProps & {
    isConnecting?: boolean;
  }
>(({ isConnecting }) => ({
  width: 'fit-content',
  height: 'fit-content',
  padding: '0',
  border: 'none',
  marginLeft: isConnecting ? 'unset' : 'auto',
  img: {
    width: '100%',
  },
}));
const Content = styled(DialogContent)<DialogContentProps>(({ theme }) => ({
  padding: '28px 28px 0 28px !important',
  [theme.breakpoints.down('sm')]: {
    padding: '32px 23px 0 23px !important',
  },
}));

const ErrorContent = styled(Box)<BoxProps>(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.mode === 'dark' ? '#F1EFEF' : '#565656',
  fontFamily: 'Poppins',
  fontWeight: 500,
  fontSize: '16px',
  textTransform: 'capitalize',
}));

const Wrapper = styled(Box)<BoxProps>(() => ({
  minWidth: 'fit-content',
  width: 'fit-content',
  height: 'fit-content',
}));

const DialogBottom = styled(Box)<
  BoxProps & {
    isConnecting: boolean;
  }
>(({ isConnecting, theme }) => ({
  height: isConnecting ? '135px' : '104px',
  marginTop: isConnecting ? '10px' : '2px',
  display: isConnecting ? 'flex' : 'block',
  justifyContent: 'center',
  '& .title1': {
    '& span': {
      color: '#f7912c',
    },
  },
  '& .title2': {
    '& span': {
      color: '#3b99fb',
    },
  },
  [theme.breakpoints.down('sm')]: {
    height: isConnecting ? '136px' : '100px',
    marginTop: isConnecting ? '17px' : '12px',
  },
}));

const ConnectWalletBtn = styled(Button)<ButtonProps>(() => ({
  background: '#3864FF',
  borderRadius: '8px',
  textTransform: 'unset',
  color: '#FFFFFF',
  width: '152px',
  height: '38px',
  boxSizing: 'border-box',
  padding: '13px 22px',
  fontFamily: 'Poppins',
  fontWeight: 700,
  fontSize: '14px',
  marginTop: '26px',
  '&:hover': {
    cursor: 'pointer',
    opacity: 0.9,
    boxShadow: 'none',
    backgroundColor: '#3864FF',
  },
}));

export const ConnectWalletModal = ({
  open,
  data,
  onClose,
  isConnecting = true,
  connectingTo = 'metamask',
  isError = true,
  onClickBackBtn,
}: Props) => {
  const theme = useTheme();
  const getConnectingWallet = (id: string) => {
    return data.find((item) => item.id == id) || ({} as WalletItem);
  };

  return (
    <BootstrapDialog className="Wallet-dialog" open={open}>
      <Header>
        {isConnecting ? (
          <>
            <CloseIcon onClick={onClickBackBtn} isConnecting={isConnecting}>
              <img src={theme.palette.mode === 'dark' ? whiteBlackArrowIcon : darkBlackArrowIcon} />
            </CloseIcon>
            <CloseIcon onClick={onClose} isConnecting={isConnecting}>
              <img src={theme.palette.mode === 'dark' ? whiteCloseIcon : darkCloseIcon} />
            </CloseIcon>
          </>
        ) : (
          <>
            <Text>Connect To A Wallet</Text>
            <CloseIcon onClick={onClose} isConnecting={isConnecting}>
              <img src={theme.palette.mode === 'dark' ? whiteCloseIcon : darkCloseIcon} />
            </CloseIcon>
          </>
        )}
      </Header>
      <Content>
        {isConnecting ? (
          <WalletItem isError={isError}>
            <WalletName>{getConnectingWallet(connectingTo).name}</WalletName>
            <ImageBox>
              <img
                style={{
                  width: '100%',
                  height: '100%',
                }}
                src={getConnectingWallet(connectingTo).img}
              />
            </ImageBox>
          </WalletItem>
        ) : (
          <>
            {data.map((item) => {
              return (
                <WalletItem
                  key={item.id}
                  onClick={() => {
                    item.handleConnectWallet(item.id);
                  }}
                >
                  <WalletName>{item.name}</WalletName>
                  <ImageBox>
                    <img
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      src={item.img}
                    />
                  </ImageBox>
                </WalletItem>
              );
            })}
          </>
        )}
      </Content>
      <DialogBottom isConnecting={isConnecting}>
        {isConnecting ? (
          isError ? (
            <Wrapper>
              <ErrorContent>Error Connecting</ErrorContent>
              <ConnectWalletBtn
                onClick={() => {
                  const item = getConnectingWallet(connectingTo);
                  item.handleConnectWallet(item.id);
                }}
              >
                Try Again
              </ConnectWalletBtn>
            </Wrapper>
          ) : (
            <ErrorContent>Connecting...</ErrorContent>
          )
        ) : (
          <>
            <DialogBottomTitle>{`Don't See your Wallet Provider?`}</DialogBottomTitle>
            <DialogBottomContent className="title1">
              {`If You're On`} <span>Desktop</span>, Try <span>MetaMask</span>
            </DialogBottomContent>
            <DialogBottomContent className="title2">
              {`If You're On`} <span>Mobile</span>, Try <span>WalletConnect</span>
            </DialogBottomContent>
          </>
        )}
      </DialogBottom>
    </BootstrapDialog>
  );
};
