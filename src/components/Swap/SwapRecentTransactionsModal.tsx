import React from 'react';
import { styled, useTheme } from '@mui/material/styles';

import {
  Typography,
  TypographyProps,
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  // Slide,
  IconButton,
  IconButtonProps,
  Avatar,
  Box,
  BoxProps,
} from '@mui/material';
// import { TransitionProps } from '@mui/material/transitions';

import { ReactComponent as CloseImg } from 'assets/images/charm_cross.svg';
import { ReactComponent as SwitchIcon } from 'assets/images/switch.svg';
import { ReactComponent as SwitchDarkIcon } from 'assets/images/exchange-dark.svg';
import externalLinkIc from 'assets/images/external-link-ic.svg';

interface Props {
  open: boolean;
  data: Array<any>;
  onClose: () => void;
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
    width: '437px',
    boxShadow: '0px 4px 67px rgba(0, 0, 0, 0.09)',
    borderRadius: '11px',
    padding: '25px 21px 22px',
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
  padding: '0px',
  marginBottom: '26px',
}));

const Content = styled(DialogContent)<DialogContentCustomProps>(({}) => ({
  padding: '0px',
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

const ListView = styled(Box)<BoxProps>(() => ({
  width: '100%',
  overflowY: 'scroll',
  maxHeight: '385px',
  '&::-webkit-scrollbar': {
    width: '4px',
    height: '4px',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'none',
    webkitBoxShadow: 'none',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#3864FF',
    outline: 'none',
    borderRadius: '10px',
  },
}));

const BoxDetail = styled(Box)<BoxProps>(({ theme }) => ({
  marginLeft: '18px',

  h3: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '30px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    margin: '0 0 3px',

    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      lineHeight: '26px',
    },
  },

  p: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '22px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    margin: '0',
    opacity: 0.7,

    span: {
      color: theme.palette.mode === 'light' ? '#0052FF' : '#0052FF',
    },
  },
}));

const ListItem = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  border: '1px solid rgba(169, 169, 169, 0.2)',
  boxSizing: 'border-box',
  borderRadius: '8px',
  padding: '7px 12px',
  marginBottom: '23px',
}));

const ListHeader = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '24px',

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
}));

const ImageContainer = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const Icon = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'inline-block',
  width: '16px',
  height: '14px',
  marginLeft: '10px',
  border: 'none',
  backgroundColor: theme.palette.mode === 'light' ? '#333333' : '#fff',
  mask: `url(${externalLinkIc}) no-repeat center`,
  cursor: 'pointer',
}));

const SwapRecentTransactionsModal: React.FC<Props> = ({ open, data, onClose }) => {
  const theme = useTheme();
  return (
    <Wrapper
      className="swapDialog"
      open={open}
      // TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <Header>
        <HeaderText>Recent Transactions</HeaderText>

        <CloseIcon onClick={onClose}>
          <CloseImg />
        </CloseIcon>
      </Header>
      {data.length > 0 ? (
        <Content>
          <ListHeader>
            <h5>Transaction</h5>
          </ListHeader>

          <ListView>
            {data.map((item, i) => (
              <ListItem key={i}>
                <Avatar sx={{ width: '31px', height: '31px' }} src={item.from} />
                {theme.palette.mode === 'light' ? (
                  <SwitchIcon style={{ margin: '0 12px', width: '15px' }} />
                ) : (
                  <SwitchDarkIcon style={{ margin: '0 12px', width: '15px' }} />
                )}
                <Avatar sx={{ width: '31px', height: '31px' }} src={item.to} />
                <BoxDetail>
                  <h3>{item.title}</h3>
                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    <p>
                      {item.date} <span>{item.time}</span>{' '}
                    </p>
                    <ImageContainer
                      onClick={() => {
                        window.open(`${process.env.REACT_APP_EXPLORER_URLS}/tx/${item.id}`, '_blank');
                      }}
                    >
                      <Icon />
                    </ImageContainer>
                  </div>
                </BoxDetail>
              </ListItem>
            ))}
          </ListView>
        </Content>
      ) : (
        <Content>
          <ListHeader>
            <h5
              style={{
                textTransform: 'unset',
              }}
            >
              No records found
            </h5>
          </ListHeader>
        </Content>
      )}
    </Wrapper>
  );
};

export default SwapRecentTransactionsModal;
