import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  BoxProps,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableCellProps,
  TableRow,
  Button,
  ButtonProps,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Checkbox,
  CheckboxProps,
  TableRowProps,
} from '@mui/material';

import PaginationCustom from './Pagination';
import { ReactComponent as WarnIcon } from 'assets/images/ic-warn-circle.svg';
import { ReactComponent as WarnDarkIcon } from 'assets/images/ic-warn-circle-dark.svg';
import { StakeItem } from 'services/staking';
import moment from 'moment';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import { useWeb3React } from '@web3-react/core';

interface Props {
  title?: string;
  onClaim: (index: any) => void;
  onUnstake: (index: any) => void;
  onMultipleClaim: (indexes: string[]) => void;
  onMultipleUnstake: (indexes: string[]) => void;
  selectedRows: string[];
  setSelectedRows: (indexes: string[]) => void;
  data: StakeItem[];
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  background: theme.palette.mode === 'light' ? '#FFFFFF' : '#171717',
  border: '1px solid rgba(41, 50, 71, 0.09)',
  boxSizing: 'border-box',
  borderRadius: '11px',
}));

const ButtonSelectAll = styled(Button)<ButtonProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  textAlign: 'center',
  color: '#3864FF',
  textTransform: 'capitalize',
  border: '1px solid #3864FF',
  height: '34px',
  width: '100%',
  maxWidth: '190px',
  borderRadius: '10px',

  '&:hover': {
    background: '#3864FF',
    borderColor: '#3864FF',
    color: '#fff',
  },

  [theme.breakpoints.down('lg')]: {
    maxWidth: '170px',
  },
}));

const ButtonStake = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  textAlign: 'center',
  color: '#3864FF',
  textTransform: 'capitalize',
  border: '1px solid #3864FF',
  height: '34px',
  width: 'auto',
  minWidth: '80px',
  borderRadius: '10px',
  padding: '5px 9px',

  '&:hover': {
    background: '#3864FF',
    borderColor: '#3864FF',
    color: '#fff',
  },
  // '&:disabled': {
  //   background: 'rgba(0, 0, 0, 0.26)',
  //   border: '1px solid rgba(56, 100, 255, 0.26)',
  //   color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#fff',
  // },
}));

const ButtonClaim = styled(Button)<ButtonProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  textAlign: 'center',
  background: '#3864FF',
  color: '#fff',
  textTransform: 'capitalize',
  height: '34px',
  width: 'auto',
  minWidth: '80px',
  borderRadius: '10px',
  boxShadow: 'none',
  padding: '5px 11px',
  marginLeft: '24px',

  '&:disabled': {
    background: 'unset',
    // background: 'rgba(0, 0, 0, 0.26)',
    border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
  },

  '&:hover': {
    background: '#1239C4',
    color: '#fff',
    outline: 'none',
    boxShadow: 'none',
  },

  [theme.breakpoints.down('lg')]: {
    marginLeft: '12px',
  },
}));

const TableCellHeader = styled(TableCell)<TableCellProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '17px',
  letterSpacing: '0.025em',
  textTransform: 'uppercase',
  color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.7)' : 'rgba(255, 255, 255, 0.7)',
  padding: '19px 32px 15px',
  borderBottom: '1px solid rgba(41, 50, 71, 0.09)',

  [theme.breakpoints.down('lg')]: {
    padding: '10px 16px',
    fontSize: '12px',
  },
}));

const TableCellBody = styled(TableCell)<TableCellProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '16px',
  lineHeight: '19px',
  letterSpacing: '0.025em',
  // textTransform: 'uppercase',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  padding: '18px 32px',
  borderBottom: '1px solid rgba(41, 50, 71, 0.09)',

  [theme.breakpoints.down('lg')]: {
    padding: '10px 16px',
    fontSize: '14px',
  },
}));

const ViewPagination = styled(Box)<BoxProps>(() => ({
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  padding: '19px 0',
}));

const TooltipCustom = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === 'light' ? '#e4e4e4' : '#000',
    top: '5px !important',

    ['&::before']: {
      boxShadow: '0px 1px 7px rgba(0, 0, 0, 0.08)',
      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#171717',
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#171717',
    boxShadow: '0px 1px 7px rgba(0, 0, 0, 0.08)',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    fontFamily: 'Poppins',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '22px',
    borderRadius: '7px',
    padding: '2px 10px',
    maxWidth: '552px',
    filter: theme.palette.mode === 'light' ? 'unset' : 'drop-shadow(0px 0px 5px rgba(56, 100, 255, 0.19))',
  },
  zIndex: 1200,
}));

// const ButtonClaimAll = styled(Button)<ButtonProps>(() => ({
//   fontFamily: 'Poppins',
//   fontStyle: 'normal',
//   fontWeight: '500',
//   fontSize: '14px',
//   lineHeight: '21px',
//   textAlign: 'center',
//   background: '#3864FF',
//   color: '#fff',
//   textTransform: 'capitalize',
//   height: '34px',
//   borderRadius: '10px',
//   boxShadow: 'none',
//   padding: '6px 10px',
//   maxWidth: '184px',

//   '&:disabled': {
//     background: 'rgba(56, 100, 255, 0.16)',
//     color: '#fff',
//   },

//   '&:hover': {
//     background: '#1239C4',
//     color: '#fff',
//     outline: 'none',
//     boxShadow: 'none',
//   },
// }));

// const SelectBox = styled(Checkbox)<CheckboxProps>(() => ({}));

const CheckboxCustom = styled(Checkbox)<CheckboxProps>(() => ({
  padding: 0,
  float: 'right',
  marginRight: '-30px',
  width: '23px',
  height: '23px',

  '.MuiSvgIcon-root': {
    color: '#B8B8B8',
  },
}));

const RewardsFlex = styled(Box)<BoxProps>(() => ({
  width: '100%',
  position: 'relative',

  '.Mui-checked': {
    '.MuiSvgIcon-root': {
      color: '#3864FF',
    },
  },
}));

const ViewHelp = styled(Box)<BoxProps>(() => ({
  float: 'right',
  marginRight: '-60px',
}));

const TableRowNoData = styled(TableRow)<TableRowProps>(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? 'unset' : 'rgba(255, 255, 255, 0.05)',
}));
const TableCellContent = styled(TableCell)<TableCellProps>(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : 'unset',
  padding: '11px 30px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  fontFamily: 'Poppins',
  fontSize: '14px',
  lineHeight: '25px',
  fontWeight: '500',
  border: 'none',
  maxWidth: '160px',
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

const EmptyContracts = styled(Box)<BoxProps>(({ theme }) => ({
  // minHeight: 'calc(100vh - 50px - 315px)',
  minHeight: 'calc(100vh - 50px - 600px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode === 'light' ? '#E0E0E0' : '#6B6B6B',
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: '24px',
  lineHeight: '42px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '30px',
    lineHeight: '38px',
  },
}));

const TableMyStake: React.FC<Props> = ({
  onClaim,
  data,
  selectedRows,
  setSelectedRows,
  onMultipleClaim,
  onMultipleUnstake,
  onUnstake,
}) => {
  const tableData = data.filter((item) => item.stakeDate !== '0');
  const theme = useTheme();
  const { account } = useWeb3React();
  const [currentAccount, setCurrentAccount] = useState(account);
  const [records, setRecords] = useState(data.filter((item) => item.stakeDate !== '0').slice(0, 5));
  const [pagination, setPagination] = useState({
    limit: 5,
    index: 0,
  });

  const handleSelectRow = (event: React.ChangeEvent<HTMLInputElement>, index: string) => {
    const selectedIndex = selectedRows.indexOf(index);
    let newSelected: any = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedRows.slice(0, selectedIndex), selectedRows.slice(selectedIndex + 1));
    }

    setSelectedRows(newSelected);
  };

  useEffect(() => {}, [pagination]);

  const handleChangePage = (value: number) => {
    const values = data.slice((value - 1) * pagination.limit, value * pagination.limit);
    setRecords(values);
    setPagination({
      ...pagination,
      index: value - 1,
    });
  };

  useEffect(() => {
    if (account) {
      if (account === currentAccount) {
        const totalPageCount = Math.ceil(data.length / pagination.limit);
        if (totalPageCount !== 0 && pagination.index > totalPageCount - 1) {
          setPagination({
            ...pagination,
            index: totalPageCount - 1,
          });
          const start = (totalPageCount - 1) * pagination.limit;
          const end = start + pagination.limit;
          setRecords(data.filter((item) => item.stakeDate !== '0').slice(start, end));
        } else {
          const start = pagination.index * pagination.limit;
          const end = start + pagination.limit;
          setRecords(data.filter((item) => item.stakeDate !== '0').slice(start, end));
        }
      } else {
        setPagination({
          ...pagination,
          index: 0,
        });
        setRecords([]);
        setSelectedRows([]);
      }
    } else {
      setRecords([]);
      setSelectedRows([]);
    }
    setCurrentAccount(account);
  }, [account, data]);

  const handleSelectAllClick = () => {
    const newSelecteds = tableData.map((n) => String(n.id));
    setSelectedRows(newSelecteds);
  };

  const isSelected = (index: string) => selectedRows.indexOf(index) !== -1;

  return (
    <Wrapper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCellHeader align="left">stake date</TableCellHeader>
              <TableCellHeader align="center">stake amount</TableCellHeader>
              <TableCellHeader align="center">staked time</TableCellHeader>
              <TableCellHeader align="center">rewards 0xB</TableCellHeader>
              <TableCellHeader align="right">
                {selectedRows.length > 0 ? (
                  <Box>
                    <ButtonStake
                      variant="outlined"
                      onClick={() => {
                        setSelectedRows([]);
                      }}
                      style={{
                        width: '99px',
                        marginRight: '16px',
                        marginLeft: theme.breakpoints.down('lg') ? '-60px' : '-90px',
                      }}
                    >
                      Deselect
                    </ButtonStake>
                    <ButtonStake
                      disabled={selectedRows.length === 1}
                      variant="outlined"
                      onClick={() => {
                        if (selectedRows.length === tableData.length) {
                          onUnstake('-1');
                        } else {
                          onMultipleUnstake(selectedRows);
                        }
                      }}
                    >
                      Unstake {selectedRows.length === tableData.length && 'All'}
                    </ButtonStake>
                    <ButtonClaim
                      disabled={selectedRows.length === 1}
                      onClick={() => {
                        onMultipleClaim(selectedRows);
                      }}
                      variant="contained"
                    >
                      Claim {selectedRows.length === tableData.length && 'All'}
                    </ButtonClaim>
                  </Box>
                ) : (
                  <ButtonSelectAll
                    disabled={data.length === 0}
                    variant="outlined"
                    fullWidth
                    onClick={handleSelectAllClick}
                  >
                    Select All
                  </ButtonSelectAll>
                )}
              </TableCellHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              records.map((item: any, i: number) => {
                const isItemSelected = isSelected(String(item.id));
                let claimAndUnstakeBtnDisabled = false;
                if (selectedRows.length > 0 && !isItemSelected) {
                  claimAndUnstakeBtnDisabled = true;
                }
                return (
                  <TableRow key={i} selected={isItemSelected}>
                    <TableCellBody align="left">
                      {moment.unix(Number(item.stakeDate)).format('MMM DD YYYY')}
                    </TableCellBody>
                    <TableCellBody align="center">
                      {String(item.stakedAmount) !== 'NaN'
                        ? formatForNumberLessThanCondition({
                            value: item.stakedAmount,
                            addLessThanSymbol: true,
                            minValueCondition: '0.000001',
                            callback: formatPercent,
                            callBackParams: [6],
                          })
                        : '0.0'}
                    </TableCellBody>
                    <TableCellBody align="center">{`${item.stakingTime} Days`}</TableCellBody>
                    <TableCellBody align="center">
                      <RewardsFlex>
                        {Number(item.reward) > 0
                          ? formatForNumberLessThanCondition({
                              value: item.reward,
                              addLessThanSymbol: true,
                              minValueCondition: '0.000001',
                              callback: formatPercent,
                              callBackParams: [6],
                            })
                          : '0.0'}

                        <CheckboxCustom
                          color="primary"
                          onChange={(event) => handleSelectRow(event, String(item.id))}
                          // checked={isSelected(item.id)}
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': `enhanced-table-checkbox-${i}`,
                          }}
                        />

                        <TooltipCustom
                          title={
                            <div>
                              <p style={{ margin: 0 }}>
                                If you unstake before 30 days, you will be charged 5% on your unstake amount
                              </p>
                              <p style={{ margin: 0 }}>
                                If you unstake before 60 days, you will be charged 2.5% on your unstake amount{' '}
                              </p>
                            </div>
                          }
                          arrow
                          placement="left-start"
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
                      </RewardsFlex>
                    </TableCellBody>

                    <TableCellBody align="right">
                      <ButtonStake
                        variant="outlined"
                        disabled={claimAndUnstakeBtnDisabled}
                        onClick={() => {
                          onUnstake(item.id);
                        }}
                      >
                        Unstake
                      </ButtonStake>
                      <ButtonClaim
                        variant="contained"
                        disabled={claimAndUnstakeBtnDisabled}
                        onClick={() => {
                          onClaim(item.id);
                        }}
                      >
                        Claim
                      </ButtonClaim>
                    </TableCellBody>
                  </TableRow>
                );
              })
            ) : (
              <TableRowNoData>
                <TableCellContent colSpan={7}>
                  <EmptyContracts>No Records Found</EmptyContracts>
                </TableCellContent>
              </TableRowNoData>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {data.length > pagination.limit && (
        <ViewPagination>
          <PaginationCustom
            total={data.length}
            limit={pagination.limit}
            page={pagination.index + 1}
            onChange={handleChangePage}
          />{' '}
        </ViewPagination>
      )}
    </Wrapper>
  );
};

export default TableMyStake;
