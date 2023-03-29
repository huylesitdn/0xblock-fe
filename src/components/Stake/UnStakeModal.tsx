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
} from '@mui/material';

import { ReactComponent as CloseImg } from 'assets/images/charm_cross.svg';
import { calculateEarlyUnstakingFee } from 'helpers/staking';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import get from 'lodash/get';
import { useWindowSize } from 'hooks/useWindowSize';
import { useAppSelector } from 'stores/hooks';

interface DataItem {
  stakedAmount: string;
  stakedTime: string;
  rewards: string;
  stakedTimeStamp: string;
}
interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (type: 'all' | 'one') => void;
  data: DataItem[];
  type: 'all' | 'one';
  isOxbPool: boolean;
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
  padding: '0px 20px 33px',
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
  marginTop: '20px',

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

const StakeDetail = styled(Box)<BoxProps>(({ theme }) => ({
  margin: '0 15px',

  [theme.breakpoints.down('md')]: {
    border: theme.palette.mode === 'light' ? '1px solid rgba(41, 50, 71, 0.09)' : '1px solid rgba(255, 255, 255, 0.8)',
    padding: '40px 20px 35px',
    boxSizing: 'border-box',
    borderRadius: '11px',
    margin: '0',
    marginBottom: '26px',
  },
}));

const BoxDetail = styled(Box)<BoxProps>(({ theme }) => ({
  background: theme.palette.mode === 'light' ? '#fff' : 'unset',
  border: theme.palette.mode === 'light' ? '1px solid rgba(41, 50, 71, 0.09)' : '1px solid rgba(255, 255, 255, 0.8)',
  borderRadius: '11px',
  padding: '25px 20px 26px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '21px',

  [theme.breakpoints.down('md')]: {
    display: 'block',
    border: 'none',
    margin: 0,
    padding: 0,

    '.boxItem': {
      width: '100%',
      marginBottom: '42px',

      '&:last-child': {
        marginBottom: '0',
      },
    },
  },

  '.boxItem': {
    textAlign: 'center',

    '&:last-child': {
      marginLeft: 'auto',
    },
  },

  h3: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '21px',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 9px',
  },

  h4: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '18px',
    lineHeight: '21px',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: '0 0',
  },
}));
const Divider = styled(Box)<BoxProps>(() => ({
  height: '42px',
}));
const UnStakeModal: React.FC<Props> = ({ open, onClose, data, type, onConfirm, isOxbPool }) => {
  const [size] = useWindowSize();
  const stakingFeeTimes = useAppSelector((state) => state.stake.stakingFeeTimeLevels);

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

  const calculateTotalStakingTime = (records: DataItem[]) => {
    return get(records, '[0].stakedTime', 0);
  };

  return (
    <Wrapper className="swapDialog" open={open} keepMounted aria-describedby="alert-dialog-slide-description">
      <Header>
        <HeaderText>Unstake {type === 'all' && 'All'}</HeaderText>

        <CloseIcon onClick={onClose}>
          <CloseImg />
        </CloseIcon>
      </Header>

      <Content>
        <StakeDetail>
          <BoxDetail>
            <div className="boxItem">
              <h3>{type === 'all' && 'Total '}Unstake Amount</h3>
              <h4>
                {formatForNumberLessThanCondition({
                  value: String(calculateTotalStakedAmount(data)),
                  addLessThanSymbol: true,
                  minValueCondition: '0.000001',
                  callBackParams: [6],
                  callback: formatPercent,
                })}{' '}
                {isOxbPool ? '0xB' : 'LP'}
              </h4>
            </div>
            <div className="boxItem">
              <h3>{type === 'all' && 'Total '}Earned Reward</h3>
              <h4>
                {formatForNumberLessThanCondition({
                  value: String(calculateTotalEarnedReward(data)),
                  addLessThanSymbol: true,
                  minValueCondition: '0.000001',
                  callBackParams: [6],
                  callback: formatPercent,
                })}{' '}
                0xB
              </h4>
            </div>
          </BoxDetail>
          {size < 900 && <Divider />}
          <BoxDetail>
            <div className="boxItem">
              <h3>{type === 'all' ? 'Total staked time' : 'Staked time'}</h3>
              <h4>{calculateTotalStakingTime(data)} days</h4>
            </div>
            <div className="boxItem">
              <h3>{type === 'all' && 'Total '}Early Unstake fee</h3>
              <h4>
                {formatForNumberLessThanCondition({
                  value: String(handleCalculateUnstakeFee(data)),
                  addLessThanSymbol: true,
                  minValueCondition: '0.000001',
                  callBackParams: [6],
                  callback: formatPercent,
                })}{' '}
                {isOxbPool ? '0xB' : 'LP'}
              </h4>
            </div>
          </BoxDetail>
        </StakeDetail>

        <ButtonConfirm variant="contained" fullWidth onClick={() => onConfirm(type)}>
          Confirm
        </ButtonConfirm>
      </Content>
    </Wrapper>
  );
};

export default UnStakeModal;
