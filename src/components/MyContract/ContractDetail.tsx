import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Button, ButtonProps, Grid, Typography, TypographyProps, Tooltip } from '@mui/material';

import { formatTimestampV2 } from 'helpers/formatTimestamp';
import { formatCType } from 'helpers/formatCType';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { bigNumber2NumberV3 } from 'helpers/formatNumber';
import { useAppSelector } from 'stores/hooks';
import { formatAndTruncateNumber } from 'helpers/formatAndTruncateNumber';

interface Props {
  mintDate: string;
  type: string;
  initial: string;
  name: string;
  rewards: number;
  current: number;
  nodeIndex: number;
  claimedReward: number;
  onClaimClick: (arg1: number, arg2: string) => void;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
  padding: '28px 14px 14px',
  background: theme.palette.mode === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.1)',
  borderRadius: '14px',
  marginBottom: '7px',
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 'normal',
  fontSize: '12px',
  lineHeight: '14px',
  color: theme.palette.mode === 'light' ? '#A4A9B7' : ' #828282',
}));

const Text = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '26px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden !important',
  textOverflow: 'ellipsis',
}));

const ButtonClaim = styled(Button)<ButtonProps>(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  padding: '8px 17px',
  textTransform: 'unset',
  borderRadius: '10px',
  boxShadow: 'none',
  height: '36px',
  marginTop: '15px',
  color: theme.palette.mode === 'light' ? theme.palette.primary.light : '#fff',
  border: `1px solid ${theme.palette.mode === 'light' ? theme.palette.primary.light : '#fff'}`,

  '&:hover': {
    cursor: 'pointed',
    opacity: 0.7,
  },
}));

const ContractDetail: React.FC<Props> = ({
  mintDate,
  type,
  initial,
  name,
  rewards,
  current,
  nodeIndex,
  claimedReward,
  onClaimClick,
}) => {
  const isClaimingReward = useAppSelector((state) => state.contract.isClaimingReward);

  return (
    <Wrapper>
      <Grid container spacing="19px">
        <Grid item xs={4}>
          <Box>
            <Title>Mint Date</Title>
            <Tooltip title={formatTimestampV2(mintDate)}>
              <Text>{formatTimestampV2(mintDate)}</Text>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Title>Type</Title>
            <Tooltip title={formatCType(type)}>
              <Text>{formatCType(type)}</Text>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Title>Initial 0xB/day </Title>
            <Tooltip title={initial}>
              <Text>{initial}</Text>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Title>Name</Title>
            <Tooltip title={name}>
              <Text>{name}</Text>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Title>Rewards</Title>
            <Tooltip
              title={formatForNumberLessThanCondition({
                value: bigNumber2NumberV3(String(rewards), 1e18),
                minValueCondition: 0.001,
                callback: formatAndTruncateNumber,
              })}
            >
              <Text>
                {formatForNumberLessThanCondition({
                  value: bigNumber2NumberV3(String(rewards), 1e18),
                  minValueCondition: 0.001,
                  callback: formatAndTruncateNumber,
                })}
              </Text>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Title>Current 0xB/day</Title>
            <Tooltip title={current}>
              <Text>{current}</Text>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Title>Claimed 0xB</Title>
            <Tooltip
              title={formatForNumberLessThanCondition({
                value: bigNumber2NumberV3(String(claimedReward), 1e18),
                minValueCondition: 0.001,
                callback: formatAndTruncateNumber,
              })}
            >
              <Text>
                {formatForNumberLessThanCondition({
                  value: bigNumber2NumberV3(String(claimedReward), 1e18),
                  minValueCondition: 0.001,
                  callback: formatAndTruncateNumber,
                })}
              </Text>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Title>Due Days</Title>
            <Tooltip title={20}>
              <Text>{20}</Text>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      <ButtonClaim
        size="small"
        variant="outlined"
        color="primary"
        fullWidth
        disabled={isClaimingReward}
        onClick={() => {
          onClaimClick(nodeIndex, type);
        }}
      >
        Claim
      </ButtonClaim>
    </Wrapper>
  );
};

export default ContractDetail;
