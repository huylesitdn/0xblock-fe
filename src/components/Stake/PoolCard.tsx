import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Typography, TypographyProps, Button, ButtonProps, Grid } from '@mui/material';

import OxToken from 'assets/images/0x-token.png';
import AvaxToken from 'assets/images/avax-token.png';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useToast } from 'hooks/useToast';
import { errorMessage } from 'messages/errorMessages';
import { addEthereumChain } from 'helpers';
import { injected } from 'connectors';
import { setIsOpenSelectWalletModal } from 'services/account';
import { useAppDispatch } from 'stores/hooks';
interface Props {
  title: String;
  onNext: (value: number) => void;
  liquidity: string;
  apr: string;
  stakedAmount: string;
  id: number;
  onClaimAll: () => void;
  isOxbPool: boolean;
}

interface LineProps {
  color: string;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  background: theme.palette.mode === 'light' ? '#FFFFFF' : '#171717',
  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
  boxSizing: 'border-box',
  boxShadow:
    theme.palette.mode === 'light' ? '0px 2px 17px rgba(213, 215, 222, 0.24)' : '0px 2px 17px rgba(17, 18, 19, 0.24)',
  borderRadius: '27px 27px 27px 29px',
  padding: '35px 49px 35px 39px',

  [theme.breakpoints.down('lg')]: {
    padding: '34px 30px',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '34px 30px',
  },

  '@media(max-width: 320px)': {
    padding: '26px 20px',
  },
}));

const BoxHeader = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '42px',
}));

const ViewIcon = styled(Box)<BoxProps>(({ theme }) => ({
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  overflow: 'hidden',
  marginRight: '9px',

  img: {
    maxWidth: '100%',
  },

  [theme.breakpoints.down('lg')]: {
    width: '30px',
    height: '30px',
  },

  [theme.breakpoints.down('md')]: {
    width: '26px',
    height: '26px',
  },
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginLeft: '10px',
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '22px',
  lineHeight: '26px',
  letterSpacing: '0.025em',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',

  [theme.breakpoints.down('lg')]: {
    fontSize: '20px',
  },

  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
  },
}));

const BoxContent = styled(Box)<BoxProps>(() => ({
  width: '100%',
}));

const BoxActions = styled(Box)<BoxProps>(() => ({
  width: '100%',
  marginTop: '46px',
}));

const Line = styled(Box)<LineProps>(({ color }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '19px',
  overflow: 'hidden',

  p: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '16px',
    textAlign: 'center',
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: color,
    margin: '0 0',
    minWidth: '100px',

    '&:first-child': {
      marginRight: 'auto',
      textAlign: 'left',
    },

    '&:last-child': {
      marginLeft: 'auto',
      textAlign: 'right',
    },

    '@media(max-width: 320px)': {
      minWidth: '70px',
    },
  },

  h4: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '18px',
    textAlign: 'center',
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: color,
    margin: '0 0',
    minWidth: '100px',

    '&:first-child': {
      marginRight: 'auto',
      textAlign: 'left',
    },

    '&:last-child': {
      marginLeft: 'auto',
      textAlign: 'center',
    },

    '@media(max-width: 320px)': {
      minWidth: '70px',
    },
  },
}));

const ButtonStake = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
  color: '#3864FF',
  textTransform: 'capitalize',
  border: '1px solid #3864FF',
  height: '46px',
  borderRadius: '14px',

  '&:hover': {
    background: '#3864FF',
    borderColor: '#3864FF',
    color: '#fff',
  },
}));

const ButtonClaim = styled(Button)<ButtonProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
  background: '#3864FF',
  color: '#fff',
  textTransform: 'capitalize',
  // border: '1px solid #3864FF',
  height: '46px',
  borderRadius: '14px',
  boxShadow: 'none',

  '&:disabled': {
    background: 'rgba(56, 100, 255, 0.16)',
    color: theme.palette.mode === 'dark' ? '#171717' : '#FFFFFF',
  },

  '&:hover': {
    background: '#1239C4',
    color: '#fff',
    outline: 'none',
    boxShadow: 'none',
  },
}));

const PoolCard: React.FC<Props> = ({ onNext, title, liquidity, apr, stakedAmount, id, onClaimAll, isOxbPool }) => {
  const theme = useTheme();
  const { account, error, connector, activate } = useWeb3React();
  const { createToast } = useToast();
  const dispatch = useAppDispatch();

  const handleConnectWallet = async () => {
    if (error instanceof UnsupportedChainIdError) {
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
    } else {
      dispatch(setIsOpenSelectWalletModal(true));
    }
  };
  return (
    <Wrapper>
      <BoxHeader>
        <ViewIcon>
          <img alt="" src={OxToken} />
        </ViewIcon>
        {!isOxbPool && (
          <ViewIcon>
            <img alt="" src={AvaxToken} />
          </ViewIcon>
        )}
        <Title>{title}</Title>
      </BoxHeader>

      <BoxContent>
        <Line color={theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.7)' : 'rgba(255, 255, 255, 0.7)'}>
          <p>Liquidity</p>
          <p>APR</p>
          <p>Your Stake</p>
        </Line>
        <Line color={theme.palette.mode === 'light' ? '#293247' : '#fff'}>
          <h4>
            $
            {formatForNumberLessThanCondition({
              value: liquidity,
              minValueCondition: '0.000001',
              addLessThanSymbol: true,
              callback: formatPercent,
              callBackParams: [6],
            })}
          </h4>
          <h4>
            {formatForNumberLessThanCondition({
              value: apr,
              minValueCondition: '0.01',
              addLessThanSymbol: true,
              callback: formatPercent,
              callBackParams: [2],
            })}
            %
          </h4>
          <h4>
            {stakedAmount !== '0' ? (
              <>
                {formatForNumberLessThanCondition({
                  value: stakedAmount,
                  minValueCondition: '0.000001',
                  addLessThanSymbol: true,
                  callback: formatPercent,
                  callBackParams: [6],
                })}{' '}
                {isOxbPool ? '0xB' : 'LP'}
              </>
            ) : (
              '-'
            )}
          </h4>
        </Line>
      </BoxContent>

      <BoxActions>
        <Grid container spacing={{ lg: '39px', md: '20px', xs: '47px' }}>
          {account ? (
            <>
              <Grid item xs={6}>
                <ButtonStake
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    onNext(id);
                  }}
                >
                  Stake
                </ButtonStake>
              </Grid>
              <Grid item xs={6}>
                <ButtonClaim disabled={Number(stakedAmount) <= 0} variant="contained" fullWidth onClick={onClaimAll}>
                  Claim
                </ButtonClaim>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <ButtonStake
                sx={{
                  fontSize: '14px',
                }}
                onClick={handleConnectWallet}
                variant="outlined"
                fullWidth
              >
                Connect Wallet
              </ButtonStake>
            </Grid>
          )}
        </Grid>
      </BoxActions>
    </Wrapper>
  );
};

export default PoolCard;
