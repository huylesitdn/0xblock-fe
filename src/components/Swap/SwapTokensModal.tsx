import React from 'react';
import { styled } from '@mui/material/styles';

import {
  Typography,
  TypographyProps,
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  IconButton,
  IconButtonProps,
  List,
  ListProps,
  ListItemButton,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Box,
  BoxProps,
} from '@mui/material';

import { ReactComponent as CloseImg } from 'assets/images/charm_cross.svg';
import { SwapTokenId } from 'hooks/swap';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPrice } from 'helpers/formatPrice';

interface Props {
  open: boolean;
  active: number | any;
  tokens: Array<any>;
  onClose: () => void;
  onSelect: (tokenId: SwapTokenId) => void;
}

interface DialogTitleCustomProps {
  denied?: boolean;
}

interface DialogContentCustomProps {
  denied?: boolean;
}

interface BalanceValueProps extends TypographyProps {
  selected?: boolean;
}

const Wrapper = styled(Dialog)<DialogProps>(({ theme }) => ({
  background: 'rgba(165, 199, 251, 0.38)',
  zIndex: 1700,

  '.MuiDialog-container': {
    background: theme.palette.mode === 'light' ? 'rgba(165, 199, 251, 0.38)' : '#9f9f9f2f',
  },

  '.MuiPaper-root': {
    width: '437px',
    boxShadow: '0px 4px 67px rgba(0, 0, 0, 0.09)',
    borderRadius: '11px',
    padding: '0',
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

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

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
  padding: '25px 21px',
}));

const Content = styled(DialogContent)<DialogContentCustomProps>(({}) => ({
  padding: '0px 0 23px',
  overflow: 'hidden',

  '.MuiDialogContentText-root': {
    color: '#828282',
    fontFamily: 'Poppins',
    fontSize: '12px',
    lineHeight: '18px',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
}));

const BalanceValue = styled(Typography)<BalanceValueProps>(({ selected, theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '30px',
  textAlign: 'right',
  letterSpacing: '0.04em',
  textTransform: 'capitalize',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  opacity: selected ? '0.7' : 1,
}));

const ListView = styled(List)<ListProps>(({ theme }) => ({
  padding: 0,

  '.MuiListItemButton-root': {
    padding: '12px 21px',
    cursor: 'pointer',

    '&:last-child': {
      margin: 0,
    },

    '&:hover': {
      background: 'rgba(0, 82, 255, 0.02)',
    },
  },

  '.MuiListItemAvatar-root': {
    minWidth: '27px',
  },

  '.MuiAvatar-root': {
    marginRight: '9px',
  },

  '.MuiListItemText-root': {
    margin: 0,
  },

  '.MuiListItemText-secondary': {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '30px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  },

  '.MuiListItemSecondaryAction-root': {
    right: '0',

    p: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '30px',
      letterSpacing: '0.04em',
      textTransform: 'capitalize',
      color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    },
  },
}));

const ListHeader = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '22px',
  padding: '0 21px',

  h5: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '26px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.75)' : 'rgba(255, 255, 255, 0.75)',
    margin: 0,
  },
  p: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '26px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.75)' : 'rgba(255, 255, 255, 0.75)',
    margin: '0 0 0 auto',
  },
}));

const SwapTokensModal: React.FC<Props> = ({ open, tokens, onSelect, onClose }) => {
  const handleListItemClick = (tokenId: SwapTokenId) => {
    onSelect(tokenId);
    onClose();
  };

  return (
    <Wrapper
      className="swapDialog"
      open={open}
      // TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <Header>
        <HeaderText>Select Token</HeaderText>

        <CloseIcon onClick={onClose}>
          <CloseImg />
        </CloseIcon>
      </Header>

      <Content>
        <ListHeader>
          <h5>Token Name</h5>
          <p>Balance</p>
        </ListHeader>
        <ListView>
          {tokens.map((item, i) => (
            <ListItemButton
              key={i}
              onClick={() => {
                if (!item.disabled) {
                  handleListItemClick(item.id);
                }
              }}
              style={{ opacity: item.disabled ? '0.7' : '1' }}
            >
              <ListItemAvatar>
                <Avatar sx={{ width: '27px', height: '27px' }} src={item.logo} />
              </ListItemAvatar>
              <ListItemText secondary={item.name} />
              <BalanceValue>
                {item.balance === '0'
                  ? '0.0'
                  : formatForNumberLessThanCondition({
                      value: item.balance,
                      minValueCondition: 0.000001,
                      callback: formatPrice,
                      callBackParams: [6, 0],
                      addLessThanSymbol: true,
                    })}
              </BalanceValue>
            </ListItemButton>
          ))}
        </ListView>
      </Content>
    </Wrapper>
  );
};

export default SwapTokensModal;
