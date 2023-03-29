import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  BoxProps,
  Table,
  TableHead,
  TableRow,
  TableRowProps,
  TableCell,
  TableCellProps,
  TableBody,
  TableBodyProps,
  TableContainer,
  TableContainerProps,
  Button,
  ButtonProps,
} from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { formatTimestampV2 } from 'helpers/formatTimestamp';
import { formatCType } from 'helpers/formatCType';
import { bigNumber2NumberV3 } from 'helpers/formatNumber';
import MintStatusModal from 'components/Base/MintStatusModal';
import MyContractsPayFeeModal from 'components/Base/MyContractsPayFeeModal';
import {
  SquareIcon,
  CubeIcon,
  TessIcon,
  SquareDarkIcon,
  CubeDarkIcon,
  TessDarkIcon,
  AllContract,
  AllDarkContract,
} from 'assets/images';
import { setIsClaimingReward, unSetIsClaimingReward } from 'services/contract';
import { infoMessage } from 'messages/infoMessages';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatAndTruncateNumber } from 'helpers/formatAndTruncateNumber';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { ReactComponent as WarnIcon } from 'assets/images/ic-warn-blue.svg';
import { ReactComponent as WarnDarkIcon } from 'assets/images/ic-warn-circle-dark.svg';

interface Props {
  title?: string;
  data: Array<any>;
}

const EmptyContracts = styled(Box)<BoxProps>(({ theme }) => ({
  // minHeight: 'calc(100vh - 50px - 315px)',
  minHeight: 'calc(100vh - 50px - 300px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode === 'light' ? '#E0E0E0' : '#6B6B6B',
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: '36px',
  lineHeight: '42px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '30px',
    lineHeight: '38px',
  },
}));

const TableCellHeader = styled(TableCell)<TableCellProps>(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#DBECFD' : '#37393A',
  padding: '15px 10px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  fontFamily: 'Roboto',
  fontSize: '16px',
  lineHeight: '19px',
  fontWeight: 'bold',
  border: 'none',

  [theme.breakpoints.down('lg')]: {
    fontSize: '14px',
    lineHeight: '20px',
    padding: '12px 20px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
    lineHeight: '20px',
    padding: '12px 12px',
  },
}));

const TableCellContent = styled(TableCell)<TableCellProps>(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : 'unset',
  padding: '11px 10px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  fontFamily: 'Poppins',
  fontSize: '14px',
  lineHeight: '25px',
  fontWeight: '500',
  border: 'none',
  // maxWidth: '100px',
  whiteSpace: 'nowrap',
  overflow: 'hidden !important',
  textOverflow: 'ellipsis',

  [theme.breakpoints.down('lg')]: {
    fontSize: '12px',
    lineHeight: '16px',
    padding: '8px 20px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    lineHeight: '16px',
    padding: '6px 12px',
  },
}));

const ButtonClaimAll = styled(Button)<ButtonProps>(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  padding: '8px 4px',
  textTransform: 'unset',
  borderRadius: '10px',
  boxShadow: 'none',
  width: '98px',
  height: '38px',
  color: theme.palette.mode === 'light' ? `#fff` : '#fff',
  background:
    theme.palette.mode === 'light'
      ? `${theme.palette.secondary}`
      : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',

  '&:disabled': {
    background: theme.palette.mode === 'light' ? '#BCCBE2' : '#4F4F4F',
    color: theme.palette.mode === 'light' ? '#fff' : '#828282',
  },

  '&:hover': {
    cursor: 'pointed',
    color: theme.palette.mode === 'light' ? `#293247` : '#fff',
    background:
      theme.palette.mode === 'light'
        ? `${theme.palette.secondary}`
        : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',
    opacity: 0.7,
    boxShadow: 'none',
  },

  [theme.breakpoints.down('lg')]: {
    fontSize: '12px',
    lineHeight: '16px',
    padding: '6px 8px',
    width: '84px',
    height: '32px',
  },
}));

const ButtonClaim = styled(Button)<
  ButtonProps & {
    fullWidth?: boolean;
  }
>(({ theme, fullWidth }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  padding: '8px 17px',
  textTransform: 'unset',
  borderRadius: '10px',
  boxShadow: 'none',
  width: fullWidth ? '218px' : '98px',
  height: '38px',
  color: theme.palette.primary[theme.palette.mode],
  border: `1px solid ${theme.palette.primary[theme.palette.mode]}`,

  '&:hover': {
    cursor: 'pointed',
    opacity: 0.7,
  },

  [theme.breakpoints.down('lg')]: {
    fontSize: '12px',
    lineHeight: '16px',
    padding: '6px 8px',
    width: fullWidth ? '188px' : '84px',
    height: '32px',
  },
}));

const TableWrapper = styled(TableContainer)<TableContainerProps>(({ theme }) => ({
  boxShadow: '0px 23px 48px rgba(0, 0, 0, 0.06)',
  border: 'none',
  borderRadius: '20px',
  maxHeight: 'calc(100vh - 50px - 200px)',

  '&::-webkit-scrollbar-button': {
    height: '0px',
  },
  '&::-webkit-scrollbar': {
    width: '9px',
    height: '0px',
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#292929',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'none',
    webkitBoxShadow: 'none',
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#292929',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#3864FF',
    height: '0px',
    outline: 'none',
    borderRadius: '10px',
  },

  [theme.breakpoints.down('lg')]: {
    maxHeight: 'calc(100vh - 260px)',

    '&::-webkit-scrollbar-button': {
      height: '0px',
    },
    '&::-webkit-scrollbar': {
      width: '4px',
      height: '0px',
    },
  },
  [theme.breakpoints.down('md')]: {
    maxHeight: 'calc(100vh - 390px)',
  },
}));

const STATUS = ['success', 'error', 'pending', 'permission denied'];

const CustomTableBody = styled(TableBody)<TableBodyProps>(() => ({
  overflow: 'auto',
}));

const TableRowCustom = styled(TableRow)<TableRowProps>(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#292929',
  },
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#262626',
  },
}));

const TableRowNoData = styled(TableRow)<TableRowProps>(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? 'unset' : 'rgba(255, 255, 255, 0.03)',
}));

const TooltipCustom = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === 'light' ? '#e4e4e4' : '#000',
    top: '5px !important',

    ['&::before']: {
      boxShadow: '0px 1px 7px rgba(0, 0, 0, 0.08)',
      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#3E3E3E',
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#3E3E3E',
    boxShadow: '0px 1px 7px rgba(0, 0, 0, 0.08)',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    fontFamily: 'Poppins',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '22px',
    borderRadius: '7px',
    padding: '2px 10px',
  },
  zIndex: 1200,
}));

const ViewHelp = styled(Box)<BoxProps>(() => ({
  marginRight: '10px',
  display: 'flex',
}));

const BoxActions = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'right',
}));

enum ClaimingType {
  AllContracts = 'allContract',
  Cube = 'cube',
  Square = 'square',
  Tesseract = 'tesseract',
}

const TableContracts: React.FC<Props> = ({ data }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { claimAllNodes, getClaimPermit, claimNodeByNode } = useInteractiveContract();
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const isClaimingReward = useAppSelector((state) => state.contract.isClaimingReward);

  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState<any>(STATUS[2]);
  const [claimType, setClaimType] = useState<string>('');
  const [claimingType, setClaimingType] = useState<ClaimingType | null>(null);
  const [isMetamaskConfirmPopupOpening, setIsMetamaskConfirmPopupOpening] = useState(false);
  const [claimingTransactionHash, setClaimingTransactionHash] = useState('');
  const [transactionHashCompleted, setTransactionHasCompleted] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [openPayFee, setOpenPayFee] = useState(false);

  const handleToggleStatus = () => {
    if (openStatus && !isMetamaskConfirmPopupOpening) {
      dispatch(unSetIsClaimingReward());
      setClaimingTransactionHash('');
      setTransactionHasCompleted('');
      setTransactionError('');
    }
    setOpenStatus(!openStatus);
  };

  const handleTransactionCompleted = (txHash: string) => {
    setTransactionHasCompleted(txHash);
  };

  const handleTransactionError = (txHash: string) => {
    setTransactionError(txHash);
  };

  const processModal = (type: string) => {
    setStatus(STATUS[2]);
    setOpenStatus(true);
    setClaimType(type);
  };

  const getIconByMode = (type: ClaimingType | null, mode: string) => {
    if (type) {
      // TODO: return in if still need else statement?
      if (type === ClaimingType.AllContracts) return mode === 'light' ? AllContract : AllDarkContract;
      else if (type === ClaimingType.Square) return mode === 'light' ? SquareIcon : SquareDarkIcon;
      else if (type === ClaimingType.Cube) return mode === 'light' ? CubeIcon : CubeDarkIcon;
      else if (type === ClaimingType.Tesseract) return mode === 'light' ? TessIcon : TessDarkIcon;
    }
    return '';
  };

  const convertCType = (cType: string) => {
    if (cType === '') return ClaimingType.AllContracts;
    else if (cType === '0') return ClaimingType.Square;
    else if (cType === '1') return ClaimingType.Cube;
    else if (cType === '2') return ClaimingType.Tesseract;
    else return null;
  };

  const handlePayFee = (nodeIndex: number, cType: string) => {
    setClaimingType(convertCType(cType));
    processModal(`${formatCType(cType)} Contract`);
    setOpenPayFee(true);
  };

  const handleTogglePayFee = () => {
    setOpenPayFee(!openPayFee);
  };

  const handleSubmitPayFee = () => {};

  const handleClickClaimAll = async () => {
    let txHash = '';
    try {
      processModal('ALL CONTRACTS');
      setClaimingType(ClaimingType.AllContracts);
      dispatch(setIsClaimingReward());

      const claimPermit = await getClaimPermit();
      if (!claimPermit[0]) {
        processModal('');
        setClaimingType(null);
        setStatus(STATUS[3]);
        return;
      }
      setIsMetamaskConfirmPopupOpening(true);
      const response: Record<string, any> = await claimAllNodes();
      setIsMetamaskConfirmPopupOpening(false);
      if (response.hash) {
        txHash = response.hash;
        setClaimingTransactionHash(response.hash);
        await response.wait();
        handleTransactionCompleted(response.hash);
      }
    } catch (err: any) {
      if (txHash !== '') {
        handleTransactionError(txHash);
      } else {
        setIsMetamaskConfirmPopupOpening(false);
        if (!openStatus) setOpenStatus(true);
        setStatus(STATUS[1]);
        dispatch(unSetIsClaimingReward());
      }
    }
  };
  const handleClickClaimNodeByNode = async (nodeIndex: number, cType: string) => {
    let txHash = '';
    try {
      processModal(`${formatCType(cType)} Contract`);
      setClaimingType(convertCType(cType));
      dispatch(setIsClaimingReward());

      const claimPermit = await getClaimPermit();
      if (!claimPermit[0]) {
        processModal('');
        setClaimingType(null);
        setStatus(STATUS[3]);
        return;
      }
      setIsMetamaskConfirmPopupOpening(true);
      const response: Record<string, any> = await claimNodeByNode(nodeIndex);
      setIsMetamaskConfirmPopupOpening(false);
      if (response.hash) {
        txHash = response.hash;
        setClaimingTransactionHash(response.hash);
        await response.wait();
        handleTransactionCompleted(response.hash);
      }
    } catch (e: any) {
      if (txHash !== '') {
        handleTransactionError(txHash);
      } else {
        setIsMetamaskConfirmPopupOpening(false);
        if (!openStatus) setOpenStatus(true);
        setStatus(STATUS[1]);
        dispatch(unSetIsClaimingReward());
      }
    }
  };

  useEffect(() => {
    if (transactionError !== '' && claimingTransactionHash === transactionError) {
      setIsMetamaskConfirmPopupOpening(false);
      if (!openStatus) setOpenStatus(true);
      setStatus(STATUS[1]);
      dispatch(unSetIsClaimingReward());
      setTransactionError('');
    }
  }, [claimingTransactionHash, transactionError]);

  useEffect(() => {
    // if user close loading popup, claim reward status listener will be closed
    if (!openStatus && isClaimingReward && !isMetamaskConfirmPopupOpening) {
      dispatch(unSetIsClaimingReward());
      setClaimingTransactionHash('');
      setTransactionHasCompleted('');
      setTransactionError('');
    }
  }, [openStatus, isClaimingReward, isMetamaskConfirmPopupOpening]);

  useEffect(() => {
    if (claimingTransactionHash === transactionHashCompleted && claimingTransactionHash !== '') {
      setOpenStatus(true);
      setStatus(STATUS[0]);
      dispatch(unSetIsClaimingReward());
      setClaimingTransactionHash('');
      setTransactionHasCompleted('');
    }
  }, [claimingTransactionHash, transactionHashCompleted]);
  return (
    <Box>
      <TableWrapper>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCellHeader sx={{ paddingLeft: '30px' }}>Mint Date</TableCellHeader>
              <TableCellHeader align="left">Name</TableCellHeader>
              <TableCellHeader align="left">Type</TableCellHeader>
              <TableCellHeader align="center" sx={{ maxWidth: '60px' }}>
                Initial 0xB/day{' '}
              </TableCellHeader>
              <TableCellHeader align="center" sx={{ maxWidth: '60px' }}>
                Current 0xB/day
              </TableCellHeader>
              <TableCellHeader align="center">Rewards</TableCellHeader>
              <TableCellHeader align="center" sx={{ maxWidth: '60px' }}>
                Claimed 0xB
              </TableCellHeader>
              <TableCellHeader align="center">Due Days</TableCellHeader>
              <TableCellHeader align="right">
                <ButtonClaimAll
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleClickClaimAll}
                  disabled={!(currentUserAddress && data.length !== 0 && !isClaimingReward)}
                >
                  Claim all
                </ButtonClaimAll>
                <ButtonClaimAll
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleClickClaimAll}
                  disabled={!(currentUserAddress && data.length !== 0 && !isClaimingReward)}
                  sx={{ marginLeft: '19px' }}
                >
                  Pay All Fees
                </ButtonClaimAll>
              </TableCellHeader>
            </TableRow>
          </TableHead>
          <CustomTableBody>
            {data.length > 0 ? (
              data
                .filter((r) => r.mintDate !== '')
                .map((item, i) => (
                  <TableRowCustom key={i}>
                    <TableCellContent sx={{ paddingLeft: '30px', maxWidth: '60px' }}>
                      {formatTimestampV2(item.mintDate)}
                    </TableCellContent>
                    <TableCellContent sx={{ maxWidth: 160 }} align="left">
                      {item.name}
                    </TableCellContent>
                    <TableCellContent align="left">{formatCType(item.type)}</TableCellContent>
                    <TableCellContent align="center" sx={{ maxWidth: '60px' }}>
                      {item.initial}
                    </TableCellContent>
                    <TableCellContent align="center" sx={{ maxWidth: '60px' }}>
                      {item.current}
                    </TableCellContent>
                    <TableCellContent align="center">
                      {formatForNumberLessThanCondition({
                        value: bigNumber2NumberV3(item.rewards, 1e18),
                        minValueCondition: 0.001,
                        callback: formatAndTruncateNumber,
                      })}
                    </TableCellContent>
                    <TableCellContent align="center" sx={{ maxWidth: '60px' }}>
                      {formatForNumberLessThanCondition({
                        value: bigNumber2NumberV3(item.claimedRewards, 1e18),
                        minValueCondition: 0.001,
                        callback: formatAndTruncateNumber,
                      })}
                    </TableCellContent>
                    <TableCellContent align="center" sx={{ color: i === 2 ? '#FF0E0E' : 'auto' }}>
                      {i !== 4 ? 20 : '-'}
                    </TableCellContent>
                    <TableCellContent
                      sx={{
                        minWidth: '260px',
                      }}
                      align="left"
                    >
                      <BoxActions>
                        {i === 2 && (
                          <TooltipCustom
                            title={
                              <div>
                                <p style={{ margin: 0 }}>This contract will be removed after due day</p>
                              </div>
                            }
                            arrow
                            placement="top-end"
                          >
                            {theme.palette.mode === 'light' ? (
                              <ViewHelp>
                                <WarnIcon width={16} />
                              </ViewHelp>
                            ) : (
                              <ViewHelp
                                sx={{
                                  marginTop: '5px',
                                }}
                              >
                                <WarnDarkIcon width={16} />
                              </ViewHelp>
                            )}
                          </TooltipCustom>
                        )}

                        {i !== 4 ? (
                          <>
                            <ButtonClaim
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                handleClickClaimNodeByNode(data.length - i - 1, item.type);
                              }}
                              disabled={isClaimingReward}
                            >
                              Claim
                            </ButtonClaim>
                            <ButtonClaim
                              size="small"
                              variant="outlined"
                              color="primary"
                              disabled={isClaimingReward}
                              sx={{ marginLeft: '19px' }}
                              onClick={() => handlePayFee(data.length - i - 1, item.type)}
                            >
                              Pay Fee
                            </ButtonClaim>
                          </>
                        ) : (
                          <ButtonClaim
                            size="small"
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              handleClickClaimNodeByNode(data.length - i - 1, item.type);
                            }}
                            disabled={isClaimingReward}
                            sx={{ width: 215 }}
                          >
                            Claim
                          </ButtonClaim>
                        )}
                      </BoxActions>
                    </TableCellContent>
                  </TableRowCustom>
                ))
            ) : (
              <TableRowNoData>
                <TableCellContent colSpan={9}>
                  <EmptyContracts>
                    {currentUserAddress ? 'No contracts yet!' : 'You need to connect wallet!'}
                  </EmptyContracts>
                </TableCellContent>
              </TableRowNoData>
            )}
          </CustomTableBody>
        </Table>

        <MintStatusModal
          icon={getIconByMode(claimingType, theme.palette.mode)}
          name={claimType}
          open={openStatus}
          status={status}
          text={
            status === 'success'
              ? infoMessage.REWARD_CLAIM_OK.message
              : status === 'error'
              ? infoMessage.REWARD_CLAIM_FAILED.message
              : status === 'pending'
              ? infoMessage.PROCESSING.message
              : status === 'permission denied'
              ? infoMessage.PERMISSION_DENIED.message
              : 'Insufficient Tokens'
          }
          onClose={handleToggleStatus}
        />

        <MyContractsPayFeeModal
          icon={getIconByMode(claimingType, theme.palette.mode)}
          name={claimType}
          maxMint={15}
          // valueRequire={value}
          contracts={['Name']}
          open={openPayFee}
          onClose={handleTogglePayFee}
          onSubmit={handleSubmitPayFee}
        />
      </TableWrapper>
    </Box>
  );
};

export default TableContracts;
