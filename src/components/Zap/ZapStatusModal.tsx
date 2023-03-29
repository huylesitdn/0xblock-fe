import React from 'react';
import { styled, useTheme } from '@mui/material/styles';

import {
  Typography,
  TypographyProps,
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  IconButton,
  IconButtonProps,
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Link,
  LinkProps,
} from '@mui/material';

import Loading from 'components/Base/Loading';

import { ReactComponent as CloseImg } from 'assets/images/charm_cross.svg';

import SuccessGif from 'assets/images/swap-success-white.gif';
import SuccessDarkGif from 'assets/images/swap-success-dark.gif';
import ErrorGif from 'assets/images/swap-failed-white.gif';
import ErrorDarkGif from 'assets/images/swap-failed-dark.gif';

interface Props {
  open: boolean;
  status: String | null;
  onClose: () => void;
  transactionId: string;
  action?: 'zap' | 'approve';
}

interface DialogTitleCustomProps {
  denied?: boolean;
}

interface DialogContentCustomProps {
  denied?: boolean;
}

const Wrapper = styled(Dialog)<DialogProps>(({ theme }) => ({
  background: 'rgba(165, 199, 251, 0.38)',
  zIndex: 1700,

  '.MuiDialog-container': {
    background: theme.palette.mode === 'light' ? 'rgba(165, 199, 251, 0.38)' : '#9f9f9f2f',
  },

  '.MuiPaper-root': {
    width: '505px',
    boxShadow: '0px 4px 67px rgba(0, 0, 0, 0.09)',
    borderRadius: '14px',
    padding: '25px 30px 38px',
    margin: '0',
    boxSizing: 'border-box',
    background: theme.palette.mode === 'light' ? '#fff' : '#171717',
    border: theme.palette.mode === 'light' ? 'unset' : 'unset',

    [theme.breakpoints.down('sm')]: {
      width: 'calc(100%  - 36px)',
      borderRadius: '14px',
    },
  },
}));

const HeaderText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  lineHeight: '37px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  textTransform: 'capitalize',
  fontWeight: '600',
}));

const CloseIcon = styled(IconButton)<IconButtonProps>(() => ({
  width: '28px',
  height: '28px',
  padding: '0',
  border: 'none',
  marginLeft: 'auto',

  img: {
    width: '100%',
  },
}));

const Header = styled(DialogTitle)<DialogTitleCustomProps>(({}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '0px',
  marginBottom: '26px',
}));

const Content = styled(DialogContent)<DialogContentCustomProps>(({}) => ({
  padding: '0px',
  overflow: 'unset',

  '.MuiDialogContentText-root': {
    color: '#828282',
    fontFamily: 'Poppins',
    fontSize: '12px',
    lineHeight: '18px',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
}));

const SwapSubmit = styled(Button)<ButtonProps>(({ theme }) => ({
  background: '#3864FF',
  border: '1px solid rgba(56, 100, 255, 0.26)',
  boxSizing: 'border-box',
  borderRadius: '7px',
  padding: '11px',
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '18px',
  lineHeight: '33px',
  letterSpacing: '0.04em',
  textTransform: 'capitalize',
  color: theme.palette.mode === 'light' ? '#FFFFFF' : '#171717',
  marginTop: '23px',

  '&:hover': {
    background: '#3864FF',
    border: '1px solid rgba(56, 100, 255, 0.26)',
    color: theme.palette.mode === 'light' ? '#FFFFFF' : '#171717',
    boxShadow: '0px 5px 11px rgba(0, 82, 255, 0.38)',
  },
}));

const ViewLoading = styled(Box)<BoxProps>(() => ({
  textAlign: 'center',
  margin: '100px auto',
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  textAlign: 'center',
  margin: '40px auto 20px',

  h3: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '36px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    margin: '0',
  },
}));

const ViewImage = styled(Box)<BoxProps>(() => ({
  width: '240px',
  height: '240px',
  margin: '10px auto 13px',

  img: {
    width: '100%',
  },
}));

const ViewTokenLink = styled(Link)<LinkProps>(() => ({
  fontFamily: 'Poppins',
  fontWeight: '400',
  fontSize: '20px',
  lineHeight: '36px',
  letterSpacing: '0.04em',
  textTransform: 'capitalize',
  color: '#0052FF',
  margin: '0',
  cursor: 'pointer',
}));

const ZapStatusModal: React.FC<Props> = ({ open, onClose, status, transactionId, action = 'zap' }) => {
  const theme = useTheme();

  return (
    <Wrapper className="swapDialog" open={open} keepMounted aria-describedby="alert-dialog-slide-description">
      <Header>
        <HeaderText> {action === 'zap' ? 'zap' : 'Approve'} Information</HeaderText>

        <CloseIcon onClick={onClose}>
          <CloseImg />
        </CloseIcon>
      </Header>

      <Content>
        {status === 'pending' ? (
          <ViewLoading>
            <Loading />
          </ViewLoading>
        ) : (
          <StatusBox>
            <ViewImage>
              {status === 'success' ? (
                <img alt="" src={theme.palette.mode === 'light' ? SuccessGif : SuccessDarkGif} />
              ) : (
                <img alt="" src={theme.palette.mode === 'light' ? ErrorGif : ErrorDarkGif} />
              )}
            </ViewImage>

            <h3>{status === 'success' ? 'Transaction Completed' : 'Transaction Rejected'}</h3>

            {status === 'success' ? (
              <ViewTokenLink
                onClick={() => {
                  window.open(`${process.env.REACT_APP_EXPLORER_URLS}/tx/${transactionId}`, '_blank');
                }}
                underline="none"
              >
                View On SnowTrace
              </ViewTokenLink>
            ) : (
              <SwapSubmit fullWidth onClick={onClose}>
                Dismiss
              </SwapSubmit>
            )}
          </StatusBox>
        )}
      </Content>
    </Wrapper>
  );
};

export default ZapStatusModal;
