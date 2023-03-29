import React from 'react';
import { styled } from '@mui/material/styles';

import {
  Box,
  BoxProps,
  Table,
  TableProps,
  TableContainer,
  TableContainerProps,
  TableBody,
  // TableBodyProps,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TableRowProps,
  Typography,
  TypographyProps,
} from '@mui/material';

import PaginationCustom from 'components/Base/Pagination';
import { formatCapitalizeLetters } from 'helpers/formatCapitalizeLetters';
import { useAppSelector } from 'stores/hooks';
import Skeleton from '@mui/material/Skeleton';
import { range } from 'lodash';
import { formatNumberWithComas, formatPrice, truncateNumber } from 'helpers/formatPrice';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import PriceUp from 'assets/images/price-up.svg';
import PriceDown from 'assets/images/price-down.svg';
import { computeProfitAndLoss } from '../../helpers/computeProfitAndLoss';

interface Props {
  data: Array<any>;
}

interface TextUnitProps {
  status: 'increase' | 'decrease';
}

const Wrapper = styled(TableContainer)<TableContainerProps>(({ theme }) => ({
  width: '100%',
  background:
    theme.palette.mode === 'light'
      ? '#fff'
      : `linear-gradient(136.53deg, rgba(255, 255, 255, 0.126) 1.5%, rgba(255, 255, 255, 0) 48.05%, 
        rgba(255, 255, 255, 0.1739) 107.89%)`,
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
  borderRadius: '22px',
  padding: 1,
  // padding: '8px 19px 5px',
  boxSizing: 'border-box',
}));

const ViewPagination = styled(Box)<BoxProps>(() => ({
  width: '100%',
  textAlign: 'right',
  marginTop: '21px',

  'nav > ul': {
    display: 'inline-flex',
  },
}));

const TableCustom = styled(Table)<TableProps>(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: '0px 14px',
  padding: '8px 19px 5px',
  boxSizing: 'border-box',
  borderRadius: '22px',
  background: theme.palette.mode === 'light' ? '#fff' : `#252525`,

  '.noData': {
    background: 'none',
    boxShadow: 'none',
  },
}));

const TableCellHead = styled(TableCell)<TableCellProps>(({ theme }) => ({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '16px',
  color: theme.palette.mode === 'light' ? '#BDBDBD' : '#4F4F4F',
  padding: '10px',
  border: 'none',
  width: '20%',
  whiteSpace: 'nowrap',

  [theme.breakpoints.down('lg')]: {
    padding: '6px',
    fontSize: '12px',
    lineHeight: '14px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '6px',
    fontSize: '11px',
    lineHeight: '13px',
  },
}));

const TableCellContent = styled(TableCell)<TableCellProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '21px',
  color: theme.palette.mode === 'light' ? '#000' : '#fff',
  padding: '10px',
  border: 'none',
  width: '20%',

  [theme.breakpoints.down('lg')]: {
    padding: '6px',
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const TableRowHead = styled(TableRow)<TableRowProps>(({ theme }) => ({
  'th:first-child': {
    paddingLeft: '28px',
  },
  'th:last-child': {
    paddingRight: '25px',
  },

  [theme.breakpoints.down('lg')]: {
    'th:first-child': {
      paddingLeft: '14px',
    },
    'th:last-child': {
      paddingRight: '14px',
    },
  },
}));

const TableRowContent = styled(TableRow)<TableRowProps>(({ theme }) => ({
  background: theme.palette.mode === 'light' ? '#FFFFFF' : '#2F2F2F',
  boxShadow: theme.palette.mode === 'light' ? '0px -1px 10px rgba(0, 0, 0, 0.07)' : 'unset',
  borderRadius: '11px',

  'td:first-child': {
    paddingLeft: '28px',
    borderRadius: '11px 0 0 11px',
  },
  'td:last-child': {
    // paddingRight: '45px',
    borderRadius: '0 11px 11px 0',
  },

  [theme.breakpoints.down('lg')]: {
    'td:first-child': {
      paddingLeft: '14px',
    },
    'td:last-child': {
      paddingRight: '14px',
    },
  },
}));

const TextCenter = styled(Box)<BoxProps>(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

const Text = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '21px',
  color: theme.palette.mode === 'light' ? '#000' : '#fff',
  padding: '10px',
  border: 'none',
}));

const TextUnit = styled(Typography)<TextUnitProps>(({ status, theme }) => ({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '21px',
  color:
    status === 'increase'
      ? '#119F19'
      : status === 'decrease'
      ? '#CE3737'
      : theme.palette.mode === 'light'
      ? '#000'
      : '#fff',
  marginRight: '4px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const ViewIcon = styled('img')(({ theme }) => ({
  width: '32px',
  height: '32px',
  marginRight: '19px',
  borderRadius: '100%',

  [theme.breakpoints.down('lg')]: {
    width: '26px',
    height: '26px',
    marginRight: '10px',
    borderRadius: '100%',
  },
}));

const TextNoData = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 'normal',
  fontSize: '20px',
  lineHeight: '23px',
  textAlign: 'center',
  color: theme.palette.mode === 'light' ? '#4F4F4F' : '#4F4F4F',
  width: '100%',
  height: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '353px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '18px',
    lineHeight: '22px',
  },
  [theme.breakpoints.down('md')]: {},
  [theme.breakpoints.down('sm')]: {
    background: theme.palette.mode === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
    boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
    borderRadius: '22px',
  },
}));

const TextProfitPercent = styled('span')<any>(({ color }) => ({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '12px',
  color: color,
  width: '33px',
  textAlign: 'left',
}));

const ImgPrice = styled('img')<any>(({}) => ({
  width: '11px',
  height: '11px',
  objectFit: 'contain',
  marginRight: '5px',
}));

const TableSkeleton: React.FC = () => {
  return (
    <TableRowContent>
      <TableCellContent>
        <div style={{ display: 'flex' }}>
          <div style={{ paddingRight: '10px' }}>
            <Skeleton variant="circular" width={26} height={26} />
          </div>
          <Skeleton animation="wave" width={'100%'} />
        </div>
      </TableCellContent>
      <TableCellContent align="left">
        <Skeleton animation="wave" height={26} />
      </TableCellContent>
      <TableCellContent align="left">
        <Skeleton animation="wave" height={26} />
      </TableCellContent>
      <TableCellContent align="left">
        <Skeleton animation="wave" height={26} />
      </TableCellContent>
      <TableCellContent align="left">
        <Skeleton animation="wave" height={26} />
      </TableCellContent>
      <TableCellContent align="left" style={{ paddingRight: '10px' }}>
        <Skeleton animation="wave" height={26} />
      </TableCellContent>
    </TableRowContent>
  );
};

const TableInvestments: React.FC<Props> = ({ data }) => {
  const status = useAppSelector((state) => state.investments.status);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(5);

  const handleChangePage = (index: number) => {
    setPage(index - 1);
  };

  const renderContent = (value: string, status: TextUnitProps['status']) => {
    return (
      <TextCenter>
        {String(
          formatForNumberLessThanCondition({
            value,
            minValueCondition: 0.01,
            callback: formatPrice,
          }),
        ).includes('<')
          ? '<'
          : ''}
        <TextUnit status={status}>$</TextUnit>
        {formatForNumberLessThanCondition({
          value,
          minValueCondition: 0.01,
          callback: formatPrice,
          addLessThanSymbol: false,
        })}
      </TextCenter>
    );
  };

  if (status === 'loading') {
    return (
      <Box>
        <Wrapper>
          <TableCustom aria-label="simple table">
            <TableHead>
              <TableRowHead>
                <TableCellHead>Token Name</TableCellHead>
                <TableCellHead align="center">Current Token Price</TableCellHead>
                <TableCellHead align="center">Our Holdings</TableCellHead>
                <TableCellHead align="center">Our Investment (USD)</TableCellHead>
                <TableCellHead align="center">Average Buying Price (USD)</TableCellHead>
                <TableCellHead align="center">Current Investment value (USD)</TableCellHead>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {range(rowsPerPage).map((i) => (
                <TableSkeleton key={i} />
              ))}
            </TableBody>
          </TableCustom>
        </Wrapper>
      </Box>
    );
  }

  return (
    <Box>
      <Wrapper>
        <TableCustom aria-label="simple table">
          <TableHead>
            <TableRowHead>
              <TableCellHead>Token Name</TableCellHead>
              <TableCellHead align="center">Current Token Price</TableCellHead>
              <TableCellHead align="center">Our Holdings</TableCellHead>
              <TableCellHead align="center">Our Investment (USD)</TableCellHead>
              <TableCellHead align="center">Average Buying Price (USD)</TableCellHead>
              <TableCellHead align="center">Current Investment value (USD)</TableCellHead>
            </TableRowHead>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map(
              (item, i) => (
                <TableRowContent key={i}>
                  <TableCellContent>
                    <TextCenter style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <ViewIcon alt="" src={item.icon} />
                      <Text>{formatCapitalizeLetters(item.name)}</Text>
                    </TextCenter>
                  </TableCellContent>
                  <TableCellContent align="center">{renderContent(item.token_price, item.status)}</TableCellContent>
                  <TableCellContent align="center">
                    <TextCenter>
                      {formatForNumberLessThanCondition({
                        value: item.our_holdings,
                        minValueCondition: 0.01,
                        callback: formatPrice,
                      })}
                    </TextCenter>
                  </TableCellContent>
                  <TableCellContent align="center">{renderContent(item.initial, item.status)}</TableCellContent>
                  <TableCellContent align="center">{renderContent(item.avg_buy_price, item.status)}</TableCellContent>
                  <TableCellContent align="right">
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                      <Box sx={{ marginRight: '25px' }}>{renderContent(item.current_investment, item.status)}</Box>
                      <Box sx={{}}>
                        <TextCenter>
                          <ImgPrice
                            src={
                              computeProfitAndLoss(Number(item.initial), Number(item.current_investment)) > 0
                                ? PriceUp
                                : PriceDown
                            }
                            alt=""
                          />
                          <TextProfitPercent
                            color={
                              computeProfitAndLoss(Number(item.initial), Number(item.current_investment)) > 0
                                ? '#0CCD17'
                                : '#FF0000'
                            }
                          >
                            {`${formatNumberWithComas(
                              Number(
                                truncateNumber(
                                  Math.abs(computeProfitAndLoss(Number(item.initial), Number(item.current_investment))),
                                  2,
                                ),
                              ),
                            )}%`}
                          </TextProfitPercent>
                        </TextCenter>
                      </Box>
                    </Box>
                  </TableCellContent>
                </TableRowContent>
              ),
            )}

            {data.length === 0 && (
              <TableRowContent className="noData">
                <TableCellContent colSpan={6}>
                  <TextNoData>No investments yet!</TextNoData>
                </TableCellContent>
              </TableRowContent>
            )}
          </TableBody>
        </TableCustom>
      </Wrapper>

      {data.length > 0 && (
        <ViewPagination>
          <PaginationCustom total={data.length} limit={rowsPerPage} page={page + 1} onChange={handleChangePage} />
        </ViewPagination>
      )}
    </Box>
  );
};

export default TableInvestments;
