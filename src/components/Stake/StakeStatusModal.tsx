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
import { Actions } from './MyStake';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';

interface Props {
  title: string;
  open: boolean;
  status: String | null;
  onClose: () => void;
  onNextStatus: () => void;
  type: Actions;
  unstakeAmount?: string;
  errorMessage?: string;
  totalStakedAmount?: string;
  isOxbPool?: boolean;
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

const StakeStatusModal: React.FC<Props> = ({
  open,
  onClose,
  status,
  title,
  type,
  unstakeAmount = '0',
  onNextStatus,
  errorMessage = 'Transaction Rejected',
  totalStakedAmount = '0',
  isOxbPool,
}) => {
  const theme = useTheme();

  return (
    <Wrapper className="swapDialog" open={open} keepMounted aria-describedby="alert-dialog-slide-description">
      <Header>
        <HeaderText>{title}</HeaderText>

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

            {status === 'success' ? (
              type === 'approve' || type === 'stake' ? (
                <h3>Transaction Completed </h3>
              ) : (
                ''
              )
            ) : (
              <h3>{errorMessage}</h3>
            )}

            {status === 'success' && (
              <h3
                style={{
                  color: '#3864FF',
                  fontWeight: '500',
                }}
              >
                {type === 'claim' || type === 'claim_all'
                  ? ' Rewards claimed successfully '
                  : type === 'unstake' || type === 'unstake_all' || type === 'unstake_selected'
                  ? `unstake: ${formatForNumberLessThanCondition({
                      value: unstakeAmount,
                      minValueCondition: '0.000001',
                      addLessThanSymbol: true,
                      callback: formatPercent,
                      callBackParams: [6],
                    })} ${isOxbPool ? '0xB' : 'LP'}`
                  : ''}
              </h3>
            )}

            {status === 'success' && type === 'unstake_selected' && (
              <h3
                style={{
                  marginTop: '8px',
                  fontWeight: '500',
                }}
              >
                Your stake amount:{' '}
                {formatForNumberLessThanCondition({
                  value: totalStakedAmount,
                  minValueCondition: '0.000001',
                  addLessThanSymbol: true,
                  callBackParams: [6],
                  callback: formatPercent,
                })}{' '}
                {isOxbPool ? '0xB' : 'LP'}
              </h3>
            )}

            {status === 'success' ? (
              type === 'approve' || type === 'stake' ? (
                <ViewTokenLink underline="none" onClick={onNextStatus}>
                  View On SnowTrace
                </ViewTokenLink>
              ) : (
                <></>
              )
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

export default StakeStatusModal;
