import { Avatar, Box, BoxProps, styled, Tooltip, tooltipClasses, TooltipProps, useTheme } from '@mui/material';
import { ReactComponent as SwapConvertIcon } from 'assets/images/ic_round-swap-vert.svg';
import { ReactComponent as SwapConvertDarkIcon } from 'assets/images/ic_round-swap-vert-dark.svg';
import AvaxImg from 'assets/images/avax-token.png';
import OxImg from 'assets/images/0x-token.png';
import { TokenItem } from 'pages/Swap';
import React from 'react';
import { limitedStringNumbers } from 'helpers/limitedStringNumbers';
import { useTooltip } from 'hooks/swap';
const ExchangeBox = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '33px 0',
}));

const ViewConvertIcon = styled(Box)<BoxProps>(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: '1',
  width: '37px',
}));

const TokenBox = styled(Box)<BoxProps>(({ theme }) => ({
  textAlign: 'center',
  width: '45%',
  h3: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '37px',
    textAlign: 'center',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    margin: '0 0',
  },

  p: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '37px',
    textAlign: 'center',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: '#0052FF',
    margin: 0,
  },
}));

interface TooltipCustomProps extends TooltipProps {
  size?: string;
}

const TooltipCustom = styled(({ className, ...props }: TooltipCustomProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
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
interface Props {
  fromTokenInfo: TokenItem;
  toTokenInfo: TokenItem;
  exchange: {
    from: String;
    fromValue: string | null;
    to: String;
    toValue: String | null;
  };
}

export const DesktopExchangeBox = ({ exchange, fromTokenInfo, toTokenInfo }: Props) => {
  const theme = useTheme();
  const {
    open: fromValueTooltipOpen,
    handleCloseTooltip: closeFromValueTooltip,
    handleOpenTooltip: openFromValueTooltip,
  } = useTooltip();
  const {
    open: toValueTooltipOpen,
    handleCloseTooltip: closeToValueTooltip,
    handleOpenTooltip: openToValueTooltip,
  } = useTooltip();
  const fromValue = limitedStringNumbers(exchange.fromValue, 17);
  const toValue = limitedStringNumbers(exchange.toValue, 17);

  const isEnableFromTooltip = fromValue && fromValue.includes('...');
  const isEnableToTooltip = toValue && toValue.includes('...');
  return (
    <ExchangeBox>
      <TokenBox>
        <Avatar
          sx={{ width: '53px', height: '53px', margin: 0, display: 'inline-flex' }}
          src={fromTokenInfo ? fromTokenInfo.logo : AvaxImg}
        />

        <h3>{fromTokenInfo ? fromTokenInfo.name : ''}</h3>
        <TooltipCustom
          open={isEnableFromTooltip ? fromValueTooltipOpen : false}
          onMouseEnter={openFromValueTooltip}
          onMouseLeave={closeFromValueTooltip}
          placement={'top'}
          title={`${exchange.fromValue}`}
          arrow
        >
          <p>{fromValue}</p>
        </TooltipCustom>
      </TokenBox>

      <ViewConvertIcon>
        {theme.palette.mode === 'light' ? <SwapConvertIcon /> : <SwapConvertDarkIcon />}
      </ViewConvertIcon>

      <TokenBox>
        <Avatar
          sx={{ width: '53px', height: '53px', margin: 0, display: 'inline-flex' }}
          src={toTokenInfo ? toTokenInfo.logo : OxImg}
        />

        <h3>{toTokenInfo ? toTokenInfo.name : ''}</h3>
        <TooltipCustom
          open={isEnableToTooltip ? toValueTooltipOpen : false}
          onMouseEnter={openToValueTooltip}
          onMouseLeave={closeToValueTooltip}
          placement={'top'}
          title={`${exchange.toValue}`}
          arrow
        >
          <p>{toValue}</p>
        </TooltipCustom>
      </TokenBox>
    </ExchangeBox>
  );
};
