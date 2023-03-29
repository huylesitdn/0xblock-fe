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
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Button,
  ButtonProps,
  Divider,
} from '@mui/material';

import { ReactComponent as CloseImg } from 'assets/images/charm_cross.svg';

import { ReactComponent as HelpCircleIcon } from 'assets/images/bx_help-circle.svg';
import { ReactComponent as HelpCircleDarkIcon } from 'assets/images/bx_help-circle-dark.svg';
import { TokenItem } from 'pages/Swap';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import { useTooltip } from 'hooks/swap';
import { useWindowSize } from 'hooks/useWindowSize';
import { DesktopExchangeBox } from '../Swap/DesktopExchangeBox';
import { MobileExchangeBox } from '../Swap/MobileExchangeBox';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  exchange: {
    from: String;
    fromValue: string | null;
    to: String;
    toValue: String | null;
  };
  tokenList: TokenItem[];
  swapRate: String;
  slippage: string;
  minReceive: String;
  isMinReceive: Boolean;
  tradingFee: string;
  priceImpact: string;
  priceImpactStatus: string;
}

interface TooltipCustomProps extends TooltipProps {
  size?: string;
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
    padding: '25px 21px 38px',
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

const BillingBox = styled(Box)<BoxProps>(() => ({
  width: '100%',
  marginTop: '32px',
}));

const BillingLine = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',

  h4: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '26px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    display: 'inline-flex',
    alignItems: 'center',
  },

  p: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '26px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 0 auto',
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

  [theme.breakpoints.down('sm')]: {
    padding: '8px',
  },
}));

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

const ZapConfirmModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  exchange,
  tokenList,
  swapRate,
  slippage,
  minReceive,
  tradingFee,
  isMinReceive,
  priceImpact,
  priceImpactStatus,
}) => {
  const theme = useTheme();
  const [size] = useWindowSize();
  const fromTokenInfo = tokenList.filter((item) => item.id === exchange.from);
  const toTokenInfo = tokenList.filter((item) => item.id === exchange.to);
  const {
    open: minReceiveTooltipOpen,
    handleCloseTooltip: closeMinReceiveTooltip,
    handleOpenTooltip: openMinReceiveTooltip,
  } = useTooltip();
  const {
    open: tradingFeeTooltipOpen,
    handleCloseTooltip: closeTradingFeeTooltip,
    handleOpenTooltip: openTradingFeeTooltip,
  } = useTooltip();
  const {
    open: priceImpactTooltipOpen,
    handleCloseTooltip: closePriceImpactTooltip,
    handleOpenTooltip: openPriceImpactTooltip,
  } = useTooltip();

  return (
    <Wrapper
      className="swapDialog"
      open={open}
      // TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <Header>
        <HeaderText>Swap Information</HeaderText>

        <CloseIcon onClick={onClose}>
          <CloseImg />
        </CloseIcon>
      </Header>

      <Content>
        {size > 600 ? (
          <DesktopExchangeBox exchange={exchange} fromTokenInfo={fromTokenInfo[0]} toTokenInfo={toTokenInfo[0]} />
        ) : (
          <MobileExchangeBox exchange={exchange} fromTokenInfo={fromTokenInfo[0]} toTokenInfo={toTokenInfo[0]} />
        )}
        <BillingBox>
          <BillingLine>
            <h4>Rate</h4>
            <p>{swapRate}</p>
          </BillingLine>
          <BillingLine>
            <h4>Slippage tolerance</h4>
            <p>{slippage}%</p>
          </BillingLine>

          <Divider sx={{ borderColor: 'rgba(84, 91, 108, 0.2)', margin: '12px 0' }} />

          <BillingLine>
            <h4>
              {isMinReceive ? 'Min Receive' : 'Max Sold'}
              <TooltipCustom
                open={minReceiveTooltipOpen}
                onMouseEnter={openMinReceiveTooltip}
                onMouseLeave={closeMinReceiveTooltip}
                title={`Your transaction will revert if there is a large, unfavorable 
                          price movement before it is confirmed`}
                arrow
                placement={size > 600 ? 'right' : 'top'}
                size="218px"
              >
                {theme.palette.mode === 'light' ? (
                  <HelpCircleIcon style={{ marginLeft: '6px' }} />
                ) : (
                  <HelpCircleDarkIcon style={{ marginLeft: '6px' }} />
                )}
              </TooltipCustom>
            </h4>
            <p>{`${minReceive} ${isMinReceive ? exchange.to.toLocaleUpperCase() : exchange.from.toUpperCase()}`}</p>
          </BillingLine>

          <BillingLine>
            <h4>
              Trading fee{' '}
              <TooltipCustom
                open={tradingFeeTooltipOpen}
                onMouseEnter={openTradingFeeTooltip}
                onMouseLeave={closeTradingFeeTooltip}
                title={`A portion of each trade (0.3%) goes to traderjoe as
                 trading fee and 0.1% goes to marketing wallet`}
                arrow
                placement={size > 600 ? 'right' : 'top'}
                size="230px"
              >
                {theme.palette.mode === 'light' ? (
                  <HelpCircleIcon style={{ marginLeft: '6px' }} />
                ) : (
                  <HelpCircleDarkIcon style={{ marginLeft: '6px' }} />
                )}
              </TooltipCustom>
            </h4>
            <p>{tradingFee}</p>
          </BillingLine>

          <BillingLine>
            <h4>
              Price impact{' '}
              <TooltipCustom
                open={priceImpactTooltipOpen}
                onMouseEnter={openPriceImpactTooltip}
                onMouseLeave={closePriceImpactTooltip}
                title={`The difference between the market price and estimated price due to trade size`}
                arrow
                placement={size > 600 ? 'right' : 'top'}
                size="218px"
              >
                {theme.palette.mode === 'light' ? (
                  <HelpCircleIcon style={{ marginLeft: '6px' }} />
                ) : (
                  <HelpCircleDarkIcon style={{ marginLeft: '6px' }} />
                )}
              </TooltipCustom>
            </h4>
            <p
              style={{
                color:
                  priceImpactStatus === 'black'
                    ? theme.palette.mode === 'light'
                      ? 'rgba(41, 50, 71, 0.8)'
                      : '#fff'
                    : priceImpactStatus === 'pink'
                    ? 'rgb(226 120 253)'
                    : priceImpactStatus,
              }}
            >
              {formatForNumberLessThanCondition({
                value: priceImpact,
                minValueCondition: 0.01,
                callback: formatPercent,
                callBackParams: [2],
              })}
              %
            </p>
          </BillingLine>
        </BillingBox>

        <SwapSubmit fullWidth onClick={onConfirm}>
          Confirm Zap
        </SwapSubmit>
      </Content>
    </Wrapper>
  );
};

export default ZapConfirmModal;
