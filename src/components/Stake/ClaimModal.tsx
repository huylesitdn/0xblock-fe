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
import { PoolItem, StakeItem } from 'services/staking';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import moment from 'moment';
import get from 'lodash/get';
import { useAppSelector } from 'stores/hooks';

interface Props {
  open: boolean;
  type: 'claim_all' | 'claim';
  onClose: () => void;
  onConfirm: () => void;
  selectedIndex: number;
  data: PoolItem;
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
    width: '500px',
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

const ButtonReward = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '21px',
  textAlign: 'center',
  background: '#3864FF',
  color: '#fff',
  textTransform: 'capitalize',
  height: '41px',
  borderRadius: '14px',
  boxShadow: 'none',
  padding: '10px 20px',
  marginLeft: '32px',
  maxWidth: '200px',

  '&:disabled': {
    background: '#3864FF',
    color: '#fff',
  },

  '&:hover': {
    background: '#3864FF',
    color: '#fff',
    outline: 'none',
    boxShadow: 'none',
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

const TotalEarned = styled(Box)<BoxProps>(({ theme }) => ({
  background: theme.palette.mode === 'light' ? '#FFFFFF' : 'none',
  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.09)' : 'rgba(255, 255, 255, 0.8)'}`,
  boxSizing: 'border-box',
  borderRadius: '11px',
  padding: '16px',
  textAlign: 'center',
  margin: '0 16px 36px',
  maxWidth: '364px',
  minWidth: '300px',
  p: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '21px',
    textAlign: 'center',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#595872' : '#fff',
    margin: '0 auto 16px',
  },
}));

const Line = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '24px',

  p: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '26px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: 0,

    strong: {
      fontWeight: 500,
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

const ClaimModal: React.FC<Props> = ({ open, type, onClose, onConfirm, data, selectedIndex }) => {
  const pools = useAppSelector((state) => state.stake.selectedPoolData);
  const selectedPool = pools.data.filter((item) => item.id === String(selectedIndex));
  const getEarnedReward = (type: string, PoolData: PoolItem, selectedRecords: StakeItem[]) => {
    if (type === 'claim_all') {
      if (Number(PoolData.yourTotalRewardAmount) > 0) {
        return formatForNumberLessThanCondition({
          value: PoolData.yourTotalRewardAmount,
          minValueCondition: '0.000001',
          addLessThanSymbol: true,
          callback: formatPercent,
          callBackParams: [6],
        });
      } else return '0.0';
    } else {
      if (Number(get(selectedRecords, `[0].reward`, 0)) > 0) {
        return formatForNumberLessThanCondition({
          value: get(selectedRecords, `[0].reward`, 0),
          minValueCondition: '0.000001',
          addLessThanSymbol: true,
          callback: formatPercent,
          callBackParams: [6],
        });
      } else return '0.0';
    }
  };
  return (
    <Wrapper className="swapDialog" open={open} keepMounted aria-describedby="alert-dialog-slide-description">
      <Header>
        <HeaderText>{type === 'claim' ? 'Claim Rewards' : 'Claim All'}</HeaderText>

        <CloseIcon onClick={onClose}>
          <CloseImg />
        </CloseIcon>
      </Header>

      {data && (
        <Content>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TotalEarned>
              {
                <Box>
                  <p>{type === 'claim_all' && 'Total '}Earned Rewards </p>
                  <ButtonReward disabled variant="contained" style={{ margin: 0 }}>
                    {getEarnedReward(type, data, selectedPool)} 0xB
                  </ButtonReward>
                </Box>
              }
            </TotalEarned>
          </div>
          <Line>
            <p>
              {type === 'claim_all' ? 'Join' : 'Stake'} Date :{' '}
              <strong>
                {type === 'claim_all'
                  ? moment.unix(Number(get(data, 'yourStakingTime', moment().unix()))).format('MMM DD YYYY')
                  : moment.unix(Number(get(selectedPool, `[0].stakeDate`, moment().unix()))).format('MMM DD YYYY')}
              </strong>
            </p>
            <p>
              {type === 'claim_all' && 'Total '}Staked time:{' '}
              <strong>
                {type === 'claim_all'
                  ? moment().diff(moment(Number(get(data, 'yourStakingTime', moment().unix())) * 1000), 'day')
                  : moment().diff(
                      moment(Number(get(selectedPool, `[0].stakeDate`, moment().unix())) * 1000),
                      'day',
                    )}{' '}
                days
              </strong>
            </p>
          </Line>

          <Line>
            <p>
              {type === 'claim_all' && 'Total '}Stake amount:{' '}
              <strong>
                {type === 'claim_all'
                  ? formatForNumberLessThanCondition({
                      value: data.yourTotalStakedAmount,
                      minValueCondition: '0.000001',
                      addLessThanSymbol: true,
                      callback: formatPercent,
                      callBackParams: [6],
                    })
                  : formatForNumberLessThanCondition({
                      value: get(selectedPool, `[0].stakedAmount`, '0'),
                      minValueCondition: '0.000001',
                      addLessThanSymbol: true,
                      callback: formatPercent,
                      callBackParams: [6],
                    })}{' '}
                {data.lpAddress.toLocaleLowerCase() ===
                String(process.env.REACT_APP_CONTRACT_ADDRESS).toLocaleLowerCase()
                  ? '0xB'
                  : 'LP'}
              </strong>
            </p>
            {type === 'claim_all' && (
              <p>
                Your share:{' '}
                <strong>
                  {formatForNumberLessThanCondition({
                    value: data.yourShare,
                    minValueCondition: '0.01',
                    addLessThanSymbol: true,
                    callback: formatPercent,
                    callBackParams: [2],
                  })}
                  %
                </strong>
              </p>
            )}
          </Line>
          <ButtonConfirm variant="contained" fullWidth onClick={onConfirm}>
            Confirm
          </ButtonConfirm>
        </Content>
      )}
    </Wrapper>
  );
};

export default ClaimModal;
