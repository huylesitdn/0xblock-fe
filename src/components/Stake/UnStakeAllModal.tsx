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
  Button,
  ButtonProps,
  Box,
  BoxProps,
  TableContainer,
  Table,
  TableProps,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TableContainerProps,
} from '@mui/material';

import { ReactComponent as CloseImg } from 'assets/images/charm_cross.svg';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import { calculateEarlyUnstakingFee } from 'helpers/staking';
import { useAppSelector } from 'stores/hooks';
import moment from 'moment';

interface DataItem {
  stakedAmount: string;
  stakedTime: string;
  rewards: string;
  stakedTimeStamp: string;
}
interface Props {
  isOxbPool: boolean;
  open: boolean;
  onClose: () => void;
  data: DataItem[];
  type: 'claim' | 'unstake';
  handleConfirm: (type: 'claim' | 'unstake') => void;
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
    width: '550px',
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

const HeaderText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Roboto',
  fontSize: '20px',
  lineHeight: '23px',
  color: theme.palette.mode === 'light' ? '#595872' : '#fff',
  textTransform: 'capitalize',
  fontWeight: '700',
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
  padding: '0px 20px 23px',
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

const Line = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',

  p: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '29px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: 0,

    strong: {
      fontWeight: 600,
      color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : '#fff',
    },

    '&:last-child': {
      marginLeft: 'auto',
    },

    '&:first-child': {
      marginLeft: '0',
    },
  },

  [theme.breakpoints.down('sm')]: {
    display: 'inline-block',
    textAlign: 'center',
    width: '100%',
    marginBottom: '0',

    p: {
      marginBottom: '16px',
    },
  },
}));

const ButtonConfirm = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '18px',
  lineHeight: '33px',
  textAlign: 'center',
  background: '#3864FF',
  color: '#fff',
  textTransform: 'capitalize',
  height: '58px',
  borderRadius: '11px',
  boxShadow: 'none',
  padding: '10px 10px',
  minWidth: '122px',
  marginTop: '17px',

  '&:disabled': {
    background: 'rgba(56, 100, 255, 0.16)',
    color: '#fff',
  },

  '&:hover': {
    background: '#1239C4',
    color: '#fff',
    outline: 'none',
    boxShadow: 'none',
  },
}));

const TableCustom = styled(Table)<TableProps>(({ theme }) => ({
  thead: {
    tr: {
      th: {
        padding: '9px 0',
        border: 'none',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '18px',
        lineHeight: '21px',
        textAlign: 'center',
        textTransform: 'capitalize',
        color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : '#fff',
      },
    },
  },
  tbody: {
    tr: {
      td: {
        padding: '11px 0',
        border: 'none',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: '18px',
        lineHeight: '21px',
        textAlign: 'center',
        textTransform: 'capitalize',
        color: theme.palette.mode === 'light' ? '#293247' : '#fff',
      },

      '.textRed': {
        color: '#FF1111',
      },
    },
  },
}));

const CustomTableContainer = styled(TableContainer)<TableContainerProps>(() => ({
  overflowX: 'auto',
  maxHeight: '255px',
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
  marginBottom: '35px',
  marginLeft: '-20px',
  marginRight: '-20px',
  width: 'calc(100% + 20px)',
}));

const UnStakeAllModal: React.FC<Props> = ({ open, onClose, type, data, handleConfirm, isOxbPool }) => {
  const stakingFeeTimes = useAppSelector((state) => state.stake.stakingFeeTimeLevels);
  const level2TaxTime = Number(stakingFeeTimes[2]);

  const handleCalculateUnstakeFee = (records: DataItem[]) => {
    return records.reduce((acc, item) => {
      return (
        acc +
        Number(calculateEarlyUnstakingFee(Number(item.stakedAmount), Number(item.stakedTimeStamp), stakingFeeTimes))
      );
    }, 0);
  };

  const calculateTotalStakedAmount = (records: DataItem[]) => {
    return (
      records.reduce((acc, item) => {
        return acc + Number(item.stakedAmount);
      }, 0) - handleCalculateUnstakeFee(records)
    );
  };

  const calculateTotalEarnedReward = (records: DataItem[]) => {
    return records.reduce((acc, item) => {
      return acc + Number(item.rewards);
    }, 0);
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
        <HeaderText>{type === 'claim' ? 'Claim Rewards' : 'Unstake'}</HeaderText>

        <CloseIcon onClick={onClose}>
          <CloseImg />
        </CloseIcon>
      </Header>

      <Content>
        <CustomTableContainer>
          <TableCustom stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Stake Amount</TableCell>
                <TableCell size="small" align="center">
                  Staked Time
                </TableCell>
                <TableCell align="center">Rewards</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => {
                const currentTime = moment().unix();
                const timeDiff = currentTime - Number(item.stakedTimeStamp);

                return (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {item.stakedAmount !== '0'
                        ? formatForNumberLessThanCondition({
                            value: item.stakedAmount,
                            addLessThanSymbol: true,
                            minValueCondition: '0.0001',
                            callback: formatPercent,
                            callBackParams: [4],
                          })
                        : '0.0'}{' '}
                      {isOxbPool ? '0xB' : 'LP'}
                    </TableCell>
                    {timeDiff < level2TaxTime ? (
                      <TableCell size="small" className="textRed" align="center">
                        {item.stakedTime} days
                      </TableCell>
                    ) : (
                      <TableCell size="small" align="center">
                        {item.stakedTime} days
                      </TableCell>
                    )}
                    <TableCell align="center">
                      {item.rewards !== '0'
                        ? formatForNumberLessThanCondition({
                            value: item.rewards,
                            addLessThanSymbol: true,
                            minValueCondition: '0.0001',
                            callback: formatPercent,
                            callBackParams: [4],
                          })
                        : '0.0'}{' '}
                      0xB
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </TableCustom>
        </CustomTableContainer>
        {type === 'unstake' && (
          <>
            <Line>
              <p>
                Total early unstake fee:{' '}
                <strong>
                  {formatForNumberLessThanCondition({
                    value: String(handleCalculateUnstakeFee(data)),
                    minValueCondition: '0.000001',
                    addLessThanSymbol: true,
                    callback: formatPercent,
                    callBackParams: [6],
                  })}{' '}
                  {isOxbPool ? '0xB' : 'LP'}
                </strong>
              </p>
            </Line>
            <Line>
              <p>
                Total Unstake amount:{' '}
                <strong>
                  {formatForNumberLessThanCondition({
                    value: String(calculateTotalStakedAmount(data)),
                    minValueCondition: '0.000001',
                    addLessThanSymbol: true,
                    callback: formatPercent,
                    callBackParams: [6],
                  })}{' '}
                  {isOxbPool ? '0xB' : 'LP'}
                </strong>
              </p>
            </Line>
          </>
        )}
        <Line>
          <p>
            Total Earned reward:{' '}
            <strong>
              {formatForNumberLessThanCondition({
                value: String(calculateTotalEarnedReward(data)),
                addLessThanSymbol: true,
                minValueCondition: '0.000001',
                callback: formatPercent,
                callBackParams: [6],
              })}{' '}
              0xB
            </strong>
          </p>
        </Line>

        <ButtonConfirm variant="contained" fullWidth onClick={() => handleConfirm(type)}>
          Confirm
        </ButtonConfirm>
      </Content>
    </Wrapper>
  );
};

export default UnStakeAllModal;
