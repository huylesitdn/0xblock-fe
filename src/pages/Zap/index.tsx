import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Grid,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  TypographyProps,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import ErrorIcon from 'assets/images/clarity_error-line.svg';
import { ReactComponent as SwapDarkIcon } from 'assets/images/swap-dark.svg';
import { ReactComponent as SwapIcon } from 'assets/images/swap-icon.svg';
import BigNumber from 'bignumber.js';
import InputSwap from 'components/Base/InputSwap';
import { SwapTokensModal, Empty } from 'components/Zap';
import InputLP from 'components/Zap/InputLP';
import ZapStatusModal from 'components/Zap/ZapStatusModal';
import { injected } from 'connectors';
import { addEthereumChain } from 'helpers';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent, formatPrice } from 'helpers/formatPrice';
import { removeCharacterInString } from 'helpers/removeCharacterInString';
import { getMinAmountTokenToSwap } from 'helpers/swaps';
import { SwapTokenId, useSwapToken, useTooltip } from 'hooks/swap';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { useToast } from 'hooks/useToast';
import { useEstimateLPTokenAmount } from 'hooks/zap/useEstimateLPtokenAmount';
import { useLoadTokensBalance } from 'hooks/zap/useLoadTokensBalance';
import { errorMessage } from 'messages/errorMessages';
import React, { useEffect, useState } from 'react';
import { setIsOpenSelectWalletModal } from 'services/account';
import { setIsInsufficientError } from 'services/swap';
import { handleDisableZapToken, setZapSelectedName } from 'services/zap';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { ReactComponent as HelpCircleDarkIcon } from 'assets/images/bx_help-circle-dark.svg';
import { ReactComponent as HelpCircleIcon } from 'assets/images/bx_help-circle.svg';
import { useWindowSize } from 'hooks/useWindowSize';

interface Props {
  title?: string;
}

interface TextStatusProps extends TypographyProps {
  status: 'error' | 'success' | null;
}

BigNumber.config({
  EXPONENTIAL_AT: 100,
});
export interface TokenItem {
  id: SwapTokenId;
  logo: string;
  name: string;
  balance: string;
  disabled: boolean;
  isNative?: boolean;
  decimal: string;
  address: string;
  allowanceBalance: string;
}

export interface Exchange {
  fromId: SwapTokenId;
  fromValue: string | null;
  toId: SwapTokenId;
  toValue: string | null;
}
export interface ExchangeItem {
  id: SwapTokenId;
  value: string | null;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
  display: 'flex',
  paddingTop: '150px',
  paddingBottom: '100px',

  [theme.breakpoints.down('lg')]: {
    paddingTop: '90px',
    paddingBottom: '70px',
  },

  [theme.breakpoints.down('md')]: {
    paddingTop: '0',
    paddingBottom: '70px',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '0 18px 100px',
  },
}));

const TitleBlack = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '66px',
  lineHeight: '88px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  letterSpacing: '0.04em',
  textTransform: 'capitalize',
  marginTop: '68px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '58px',
    lineHeight: '64px',
  },

  [theme.breakpoints.down('md')]: {
    fontSize: '43px',
    lineHeight: '59px',
    marginTop: '30px',
  },

  [theme.breakpoints.down('sm')]: {
    marginTop: '20px',
  },
}));

const TitleWhite = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '80px',
  lineHeight: '147px',
  color: theme.palette.mode === 'light' ? '#0052FF' : '#0052FF',
  letterSpacing: '0.04em',
  textTransform: 'capitalize',
  marginBottom: '21px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '68px',
    lineHeight: '88px',
  },

  [theme.breakpoints.down('md')]: {
    fontSize: '52px',
    lineHeight: '96px',
    marginBottom: '33px',
  },
}));

const Text = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '29px',
  color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.57)' : 'rgba(255, 255, 255, 0.57)',
  letterSpacing: '0.04em',

  [theme.breakpoints.down('lg')]: {
    fontSize: '14px',
    lineHeight: '24px',
  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SwapBox = styled(Box)<BoxProps>(({ theme }) => ({
  maxWidth: '484px',
  boxSizing: 'border-box',
  background: theme.palette.mode === 'light' ? '#FFFFFF' : '#171717',
  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
  boxShadow: '0px 2px 30px rgba(56, 100, 255, 0.03)',
  borderRadius: '14px',
  padding: '35px 24px 35px',

  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '35px 18px',
    borderRadius: '9px',
  },
}));

const SwapHeader = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '32px',

  h4: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '29px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    margin: '0',
  },
}));

const ExchangeBox = styled(Box)<BoxProps>(() => ({
  width: '100%',
}));

const ExchangeHeader = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '19px',

  h5: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '26px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.65)' : 'rgba(255, 255, 255, 0.65)',
    margin: 0,
  },

  p: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '26px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 0 auto',
  },
}));

const ExchangeIcon = styled(Box)<BoxProps>(() => ({
  width: '100%',
  margin: '36px 0 21px',
  textAlign: 'center',

  svg: {
    width: '38px',
    height: '38px',

    '&:hover': {
      opacity: 0.7,
    },
  },
}));

const SwapSubmit = styled(Button)<
  ButtonProps & {
    unEnable: boolean;
    enableMarginTop?: boolean;
  }
>(({ theme, unEnable, enableMarginTop }) => ({
  background: unEnable ? 'rgba(0, 0, 0, 0.26)' : '#3864FF',
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
  marginTop: enableMarginTop ? '33px' : '7px',
  cursor: unEnable ? 'not-allowed !important' : 'pointer',
  color: theme.palette.mode === 'light' ? '#fff' : unEnable ? 'rgba(255, 255, 255, 0.3)' : '#fff',

  '&:hover': {
    background: unEnable ? 'rgba(0, 0, 0, 0.26)' : '#3864FF',
    border: '1px solid rgba(56, 100, 255, 0.26)',
    color: theme.palette.mode === 'light' ? '#fff' : unEnable ? 'rgba(255, 255, 255, 0.3)' : '#fff',
    boxShadow: !unEnable && '0px 5px 11px rgba(0, 82, 255, 0.38)',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '8px',
  },
}));

const TextStatus = styled(Typography)<TextStatusProps>(({ status }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '26px',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: '0.04em',
  textTransform: 'capitalize',
  justifyContent: 'center',
  color: status === 'error' ? '#FF0E0E' : '#0ADB12',
  marginTop: '7px',
}));
interface TooltipCustomProps extends TooltipProps {
  size?: string;
}
const TooltipCustom = styled(({ className, ...props }: TooltipCustomProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, size }) => ({
  zIndex: '2000',
  filter: 'drop-shadow(0px 0px 5px rgba(56, 100, 255, 0.19))',

  [`& .${tooltipClasses.tooltip}`]: {
    background: theme.palette.mode === 'light' ? '#fff' : '#171717',
    color: theme.palette.mode === 'light' ? 'rgba(49, 72, 98, 0.69)' : 'rgba(255, 255, 255, 0.69)',
    padding: '11px 16px',
    fontFamily: 'Poppins',
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '500',
    boxShadow: '1px 5px 29px rgba(50, 71, 117, 0.2)',
    borderRadius: '10px',
    left: '15px',
    top: '15px',
    maxWidth: size || '246px',
    minWidth: '206px',
    boxSizing: 'border-box',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === 'light' ? '#fff' : '#171717',
    top: '-15px !important',
  },

  [theme.breakpoints.down('lg')]: {
    [`& .${tooltipClasses.tooltip}`]: {
      padding: '8px 20px',
      fontSize: '12px',
      lineHeight: '22px',
      borderRadius: '10px',
      left: '10px',
    },
  },
}));

const ZapPage: React.FC<Props> = () => {
  const theme = useTheme();
  const [windowSize] = useWindowSize();
  const { error, connector, activate, account } = useWeb3React();
  const { handleZapInNativeToken, handleZapInToken, handleZapOut } = useInteractiveContract();
  const { createToast } = useToast();

  const tokenList = useAppSelector((state) => state.zap.zapTokenList);
  const liquidityPoolData = useAppSelector((state) => state.zap.liquidityPoolData);

  const { handleGetTokenBalances } = useLoadTokensBalance(tokenList, account, true);
  const { handleEstimateZapInLpTokenAmount, handleEstimateZapOutLpTokenAmount } = useEstimateLPTokenAmount();
  const { approveToken } = useSwapToken(false);

  const pairInfoLoaded = useAppSelector((state) => state.swap.pairInfoLoaded);
  const isLiquidityPoolLoaded = useAppSelector((state) => state.zap.isLiquidityPoolLoaded);

  const isInsufficientError = useAppSelector((state) => state.swap.isInsufficientError);
  const selectedName = useAppSelector((state) => state.zap.ZapSelectedName) as any;
  const isLoadEstimateToken = useAppSelector((state) => state.swap.isLoadEstimateToken);
  const isInsufficientLiquidityError = useAppSelector((state) => state.swap.isInsufficientLiquidityError);
  const dispatch = useAppDispatch();

  const [openSelect, setOpenSelect] = useState(false);
  const [isOpenSelectTokenFromModal, setIsOpenSelectTokenFromModal] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [exchangeFrom, setExchangeFrom] = useState<ExchangeItem>({
    id: SwapTokenId.AVAX,
    value: '',
  });
  const [exchangeTo, setExchangeTo] = useState<ExchangeItem>({
    id: SwapTokenId.JOELP,
    value: '',
  });

  const [isFirstTime, setIsFirstTime] = useState(true);
  const [approvedTokens, setApprovedTokens] = useState<SwapTokenId[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [isSwapMaxFromTokens, setIsSwapMaxFromToken] = useState(false);
  const [currentAction, setCurrentAction] = useState('zap');
  const [zapStatus, setZapStatus] = useState<'success' | 'error' | 'pending' | null>(null);
  const slippage = '0.5';

  const [currentTransactionId, setCurrenTransactionId] = useState({
    type: '',
    id: '',
  });
  const [zapCompleted, setZapCompleted] = useState({
    type: '',
    id: '',
  });

  const {
    open: toTokenTooltipOpen,
    handleCloseTooltip: closeToTokenTooltipOpen,
    handleOpenTooltip: openToTokenTooltipOpen,
  } = useTooltip();

  const handleToggleSelect = () => {
    setOpenSelect(!openSelect);
  };

  const handleToggleStatus = () => {
    setOpenStatus(!openStatus);
  };

  const handleResetExchangeValue = () => {
    setExchangeFrom({
      id: exchangeFrom.id,
      value: '',
    });
    setExchangeTo({
      id: exchangeTo.id,
      value: '',
    });
    setIsFirstTime(true);
  };

  const handleResetExchange = () => {
    setExchangeFrom({
      id: SwapTokenId.AVAX,
      value: '',
    });
    setExchangeTo({
      id: SwapTokenId.JOELP,
      value: '',
    });
    setIsFirstTime(true);
  };

  const handelSelectToken = (tokenId: SwapTokenId) => {
    if (isOpenSelectTokenFromModal) {
      setExchangeFrom({
        id: tokenId,
        value: exchangeFrom.value,
      });
      if (exchangeFrom.value && exchangeFrom.value !== '' && Number(exchangeFrom.value) > 0) {
        setExchangeTo({
          id: exchangeTo.id,
          value: String(handleEstimateZapInLpTokenAmount(tokenId, exchangeFrom.value || '0', liquidityPoolData)),
        });
      } else {
        setExchangeTo({
          id: exchangeTo.id,
          value: exchangeFrom.value,
        });
      }
      setApprovedTokens([]);
    } else {
      setExchangeFrom({
        id: exchangeFrom.id,
        value: exchangeFrom.value,
      });
      if (exchangeFrom.value && exchangeFrom.value !== '' && Number(exchangeFrom.value) > 0) {
        setExchangeTo({
          id: tokenId,
          value: String(handleEstimateZapOutLpTokenAmount(tokenId, exchangeFrom.value || '0', liquidityPoolData)),
        });
      } else {
        setExchangeTo({
          id: tokenId,
          value: exchangeFrom.value,
        });
      }
    }
    setIsSwapMaxFromToken(false);
  };

  const handleChangeToken = (name: string) => {
    if (name === 'from') {
      setIsOpenSelectTokenFromModal(true);
    } else {
      setIsOpenSelectTokenFromModal(false);
    }
    setOpenSelect(true);
  };

  const handleChange = (event: { value: string; name: string; isOnblur?: boolean }) => {
    const { value, name, isOnblur } = event;
    if (isOnblur) {
      if (name === 'from') {
        setExchangeFrom({
          id: exchangeFrom.id,
          value,
        });
      } else if (name === 'to') {
        setExchangeTo({
          id: exchangeTo.id,
          value,
        });
      }
    } else {
      if (selectedName === 'from') {
        if (value !== '' && Number(value) !== 0) {
          setExchangeFrom({
            id: exchangeFrom.id,
            value: value,
          });
          if (exchangeFrom.id === SwapTokenId.JOELP) {
            setExchangeTo({
              id: exchangeTo.id,
              value: String(handleEstimateZapOutLpTokenAmount(exchangeTo.id, value, liquidityPoolData)),
            });
          } else {
            setExchangeTo({
              id: exchangeTo.id,
              value: String(handleEstimateZapInLpTokenAmount(exchangeFrom.id, value, liquidityPoolData)),
            });
          }
        } else {
          setExchangeFrom({
            id: exchangeFrom.id,
            value: value,
          });
          setExchangeTo({
            id: exchangeTo.id,
            value: '',
          });
        }
      }
    }
    setIsSwapMaxFromToken(false);
    setIsFirstTime(false);
  };

  const handleFromMax = () => {
    if (account) {
      const currentToken = tokenList.filter((item) => item.id === exchangeFrom.id);
      if (Number(currentToken[0].balance) > 0) {
        if (currentToken[0]) {
          let valueIn = '0';
          if (currentToken[0].id === SwapTokenId.AVAX) {
            valueIn =
              Number(currentToken[0].balance) <= 0.01
                ? '0'
                : formatPercent(new BigNumber(currentToken[0].balance).minus(0.01).toString(), 10);
          } else {
            valueIn = formatPercent(new BigNumber(currentToken[0].balance).toString(), 10);
          }
          dispatch(setZapSelectedName('from'));
          if (exchangeFrom.id === SwapTokenId.JOELP) {
            setExchangeFrom({
              id: exchangeFrom.id,
              value: valueIn,
            });
            setExchangeTo({
              id: exchangeTo.id,
              value: String(handleEstimateZapOutLpTokenAmount(exchangeTo.id, valueIn, liquidityPoolData)),
            });
          } else {
            setExchangeFrom({
              id: exchangeFrom.id,
              value: valueIn,
            });
            setExchangeTo({
              id: exchangeTo.id,
              value: String(handleEstimateZapInLpTokenAmount(exchangeFrom.id, valueIn, liquidityPoolData)),
            });
          }
          setIsSwapMaxFromToken(true);
        }
        setIsFirstTime(false);
      }
    }
  };

  const handleZapIn = async () => {
    setCurrentAction('zap');
    handleToggleStatus();
    try {
      setZapStatus('pending');
      const fromToken = tokenList.filter((item) => item.id === exchangeFrom.id);
      let fromValue = '0';
      // convert input
      if (isSwapMaxFromTokens && fromToken[0]) {
        if (fromToken[0].id === SwapTokenId.AVAX) {
          fromValue = new BigNumber(fromToken[0].balance).minus(0.01).toString();
        } else {
          fromValue = new BigNumber(fromToken[0].balance).toString();
        }
      } else {
        fromValue = new BigNumber(exchangeFrom.value || 0).toString();
      }
      // exec zap

      if (fromToken[0].id === SwapTokenId.AVAX) {
        const transaction = await handleZapInNativeToken(fromValue, account!);
        // wait for response
        if (transaction.hash) {
          setCurrenTransactionId({
            id: transaction.hash,
            type: 'zap',
          });
          await transaction.wait();
          setZapCompleted({
            id: transaction.hash,
            type: 'zap',
          });
          handleGetTokenBalances();
        }
      } else {
        const transaction = await handleZapInToken(fromToken[0].address, fromValue, account!, fromToken[0].decimal);
        // wait for response
        if (transaction.hash) {
          setCurrenTransactionId({
            id: transaction.hash,
            type: 'zap',
          });
          await transaction.wait();
          setZapCompleted({
            id: transaction.hash,
            type: 'zap',
          });
          handleGetTokenBalances();
        }
      }
    } catch (error: any) {
      setZapStatus('error');
    }
  };

  const handleZapOutToken = async () => {
    setCurrentAction('zap');
    handleToggleStatus();
    try {
      setZapStatus('pending');
      const fromTokens = tokenList.filter((item) => item.id === exchangeFrom.id);
      const toTokens = tokenList.filter((item) => item.id === exchangeTo.id);
      let fromValue = '0';
      if (isSwapMaxFromTokens && fromTokens[0]) {
        if (fromTokens[0].id === SwapTokenId.AVAX) {
          fromValue = new BigNumber(fromTokens[0].balance).minus(0.01).toString();
        } else {
          fromValue = new BigNumber(fromTokens[0].balance).toString();
        }
      } else {
        fromValue = new BigNumber(exchangeFrom.value || 0).toString();
      }
      // exec zap
      const transaction = await handleZapOut(toTokens[0].address, fromValue, account!, fromTokens[0].decimal);
      // wait for response
      if (transaction.hash) {
        setCurrenTransactionId({
          id: transaction.hash,
          type: 'zap',
        });
        await transaction.wait();
        setZapCompleted({
          id: transaction.hash,
          type: 'zap',
        });
        handleGetTokenBalances();
      }
    } catch (error: any) {
      setZapStatus('error');
    }
  };

  const handleApproveToken = async (id: SwapTokenId) => {
    const tokenIn = tokenList.filter((item) => item.id === id);
    try {
      if (!tokenIn[0]) {
        throw new Error('Some thing wrong');
      }
      setCurrentAction('approve');
      handleToggleStatus();
      setZapStatus('pending');
      const response = await approveToken(tokenIn[0].address, String(process.env.REACT_APP_ZAP_MANAGER));
      if (response.hash) {
        setCurrenTransactionId({
          id: response.hash,
          type: 'approve',
        });
        await response.wait();
        setZapCompleted({
          type: 'approve',
          id: response.hash,
        });
        setApprovedTokens([...approvedTokens, id]);
        handleGetTokenBalances();
      }
    } catch (error: any) {
      setZapStatus('error');
    }
  };

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
  const handleCheckIsApproved = () => {
    const tokenFrom = tokenList.filter((item) => item.id === exchangeFrom.id);
    if (tokenFrom[0]) {
      if (isSwapMaxFromTokens) {
        if (Number(tokenFrom[0].allowanceBalance) >= Number(tokenFrom[0].balance)) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      } else {
        if (Number(tokenFrom[0].allowanceBalance) >= Number(exchangeFrom.value)) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      }
    } else {
      setIsApproved(false);
    }
  };
  const getZapTokens = (selectedToken: SwapTokenId) => {
    const clonedTokenList = [...tokenList.filter((item) => item.id !== SwapTokenId.JOELP)];
    return clonedTokenList.map((item) => {
      if (item.id == selectedToken) {
        return {
          ...item,
          disabled: true,
        };
      }
      return {
        ...item,
        disabled: false,
      };
    });
  };

  useEffect(() => {
    if (openSelect && isOpenSelectTokenFromModal) {
      const selectableTokens = getZapTokens(exchangeFrom.id);
      dispatch(handleDisableZapToken(selectableTokens));
    } else if (openSelect && !isOpenSelectTokenFromModal) {
      const selectableTokens = getZapTokens(exchangeTo.id);
      dispatch(handleDisableZapToken(selectableTokens));
    }
  }, [openSelect, selectedName, exchangeTo.id, exchangeFrom.id, isOpenSelectTokenFromModal]);

  const handleSwapIconClick = () => {
    dispatch(setZapSelectedName('from'));
    setExchangeFrom({
      id: exchangeTo.id,
      value: '',
    });
    setExchangeTo({
      id: exchangeFrom.id,
      value: '',
    });
    setIsSwapMaxFromToken(false);
    setApprovedTokens([]);
  };
  useEffect(() => {
    handleCheckIsApproved();
  }, [exchangeFrom, tokenList]);

  useEffect(() => {
    const selectedTokenId = exchangeFrom.id;
    const selectedTokenValue = exchangeFrom.value;
    const selectedToken = tokenList.filter((item) => item.id === selectedTokenId);
    if (selectedToken[0]) {
      const inputValue = new BigNumber(selectedTokenValue || 0).toNumber();
      const slippageValue = getMinAmountTokenToSwap(selectedTokenValue, slippage);
      if (
        selectedToken[0].balance === '0' ||
        Number(formatPercent(removeCharacterInString(String(selectedToken[0].balance), ','), 10)) <
          (selectedName === 'to' ? slippageValue : inputValue)
      ) {
        dispatch(setIsInsufficientError(true));
      } else {
        dispatch(setIsInsufficientError(false));
      }
    }
  }, [exchangeFrom.id, exchangeTo.value, tokenList, selectedName, slippage]);

  useEffect(() => {
    if (currentTransactionId.id !== '' && currentTransactionId.id === zapCompleted.id) {
      setZapStatus('success');
      setOpenStatus(true);
      if (zapCompleted.type !== 'approve') {
        handleResetExchangeValue();
      }
      setZapCompleted({
        id: '',
        type: '',
      });
    }
  }, [currentTransactionId, zapCompleted]);

  useEffect(() => {
    if (!account) {
      handleResetExchange();
    }
    setApprovedTokens([]);
  }, [account]);

  const fromTokens = tokenList.filter((item) => item.id === exchangeFrom.id);
  const toTokens = tokenList.filter((item) => item.id === exchangeTo.id);
  const isInvalidInput =
    selectedName === 'from'
      ? exchangeFrom.value === null || Number(exchangeFrom.value) === 0
      : exchangeTo.value === null || Number(exchangeTo.value) === 0;
  const isInvalidSwap = isInvalidInput || isInsufficientError || isInsufficientLiquidityError;
  const buttonMarginTop = isInvalidInput
    ? true
    : isInsufficientError
    ? false
    : isInsufficientLiquidityError
    ? false
    : approvedTokens.includes(fromTokens[0].id)
    ? false
    : true;
  return (
    <Wrapper>
      <Box sx={{ width: '100%' }}>
        {account ? (
          <Grid container spacing={{ xs: 0, lg: '88px' }}>
            <Grid item xs={12} md={6}>
              <TitleBlack>Zap</TitleBlack>
              <TitleWhite>Tokens</TitleWhite>
              <Text>
                {`Select the crypto you want to convert from and enter the amount of 
              tokens you want to swap. Once the transaction is confirmed, the tokens on your account will be swapped. 
              You'll see a receipt with all details.*`}
              </Text>
            </Grid>
            <Grid item xs={12} md={6}>
              <SwapBox>
                <SwapHeader>
                  <h4>Zap</h4>
                </SwapHeader>

                <ExchangeBox>
                  <ExchangeHeader>
                    <h5>From {fromTokens[0].id === SwapTokenId.JOELP ? ` LP` : ` Token`}</h5>
                    <p>
                      Balance:{' '}
                      {fromTokens.length > 0
                        ? Number(fromTokens[0].balance) > 0
                          ? formatForNumberLessThanCondition({
                              value: fromTokens[0].balance,
                              minValueCondition: '0.000001',
                              callback: formatPrice,
                              callBackParams: [6, 0],
                              addLessThanSymbol: true,
                            })
                          : '0.0'
                        : '0.0'}
                    </p>
                  </ExchangeHeader>

                  {fromTokens[0].id === SwapTokenId.JOELP ? (
                    <InputLP
                      disabled={!pairInfoLoaded || !isLiquidityPoolLoaded}
                      value={exchangeFrom.value}
                      onChange={handleChange}
                      onMax={handleFromMax}
                      isMax={true}
                      name="from"
                    />
                  ) : (
                    <InputSwap
                      disabled={!pairInfoLoaded || !isLiquidityPoolLoaded}
                      tokens={tokenList}
                      value={exchangeFrom.value}
                      selected={exchangeFrom.id}
                      onChange={handleChange}
                      onChangeToken={handleChangeToken}
                      onMax={handleFromMax}
                      isMax={true}
                      name="from"
                    />
                  )}
                </ExchangeBox>

                {/* {exchangeFrom.id === SwapTokenId.JOELP && <PercentSelects onChange={handlePercentClicked} />} */}

                <ExchangeIcon>
                  {theme.palette.mode === 'light' ? (
                    <SwapIcon
                      style={{
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (!isLoadEstimateToken) {
                          handleSwapIconClick();
                        }
                      }}
                    />
                  ) : (
                    <SwapDarkIcon
                      style={{
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (!isLoadEstimateToken) {
                          handleSwapIconClick();
                        }
                      }}
                    />
                  )}
                </ExchangeIcon>

                <ExchangeBox>
                  <ExchangeHeader>
                    <h5>To{fromTokens[0].id === SwapTokenId.JOELP ? ` Token (Estimate)` : ` LP (Estimate)`}</h5>
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <TooltipCustom
                        open={toTokenTooltipOpen}
                        onMouseEnter={openToTokenTooltipOpen}
                        onMouseLeave={closeToTokenTooltipOpen}
                        title={`Zap can cause slippage. Small amounts only`}
                        arrow
                        placement={windowSize > 600 ? 'right' : 'top'}
                        size="218px"
                      >
                        {theme.palette.mode === 'light' ? (
                          <HelpCircleIcon style={{ marginLeft: '6px' }} />
                        ) : (
                          <HelpCircleDarkIcon style={{ marginLeft: '6px' }} />
                        )}
                      </TooltipCustom>
                    </div>
                  </ExchangeHeader>

                  {toTokens[0].id === SwapTokenId.JOELP ? (
                    <InputLP
                      disabled={true}
                      value={exchangeTo.value}
                      onChange={() => {}}
                      onMax={() => {}}
                      isMax={false}
                      name="to"
                    />
                  ) : (
                    <InputSwap
                      disabled={true}
                      tokens={tokenList}
                      value={exchangeTo.value}
                      selected={exchangeTo.id}
                      onChange={() => {}}
                      onChangeToken={handleChangeToken}
                      onMax={() => {}}
                      isMax={false}
                      name="to"
                    />
                  )}
                </ExchangeBox>

                {!isFirstTime && account && isApproved && (
                  <TextStatus status={isInsufficientError || isInsufficientLiquidityError ? 'error' : 'success'}>
                    {isInvalidInput ? (
                      '  '
                    ) : isInsufficientError ? (
                      <>
                        <img alt="" src={ErrorIcon} /> {`Insufficient ${exchangeFrom.id.toUpperCase()} Balance`}
                      </>
                    ) : isInsufficientLiquidityError ? (
                      <>
                        <img alt="" src={ErrorIcon} /> {`Insufficient liquidity for this trade`}
                      </>
                    ) : approvedTokens.includes(fromTokens[0].id) ? (
                      'Approved'
                    ) : (
                      ''
                    )}
                  </TextStatus>
                )}
                {!isFirstTime ? (
                  !account ? (
                    <SwapSubmit fullWidth unEnable={false} onClick={handleConnectWallet}>
                      Connect Wallet
                    </SwapSubmit>
                  ) : isApproved ? (
                    !isInvalidInput && (
                      <SwapSubmit
                        fullWidth
                        enableMarginTop={buttonMarginTop}
                        unEnable={isInvalidSwap}
                        onClick={() => {
                          if (!isInvalidSwap) {
                            if (fromTokens[0].id !== SwapTokenId.JOELP) {
                              handleZapIn();
                            } else {
                              handleZapOutToken();
                            }
                          }
                        }}
                      >
                        Zap
                      </SwapSubmit>
                    )
                  ) : (
                    <SwapSubmit
                      fullWidth
                      unEnable={false}
                      enableMarginTop={isApproved ? buttonMarginTop : true}
                      onClick={() => {
                        handleApproveToken(exchangeFrom.id);
                      }}
                    >
                      Approve {exchangeFrom.id !== SwapTokenId.JOELP ? exchangeFrom.id.toLocaleUpperCase() : 'LP'}
                    </SwapSubmit>
                  )
                ) : (
                  <></>
                )}
              </SwapBox>
            </Grid>
          </Grid>
        ) : (
          <Empty />
        )}
      </Box>

      <SwapTokensModal
        open={openSelect}
        onClose={handleToggleSelect}
        tokens={tokenList.filter((item) => item.id !== SwapTokenId.OXB && item.id !== SwapTokenId.JOELP)}
        onSelect={handelSelectToken}
        active={selectedName === 'from' ? exchangeFrom.id : exchangeTo.id}
      />
      {openStatus && zapStatus != null && (
        <ZapStatusModal
          status={zapStatus}
          open={openStatus}
          transactionId={currentTransactionId.id}
          action={currentAction === 'zap' ? 'zap' : 'approve'}
          onClose={() => {
            handleToggleStatus();
            setCurrenTransactionId({
              type: '',
              id: '',
            });
          }}
        />
      )}
    </Wrapper>
  );
};

export default ZapPage;
