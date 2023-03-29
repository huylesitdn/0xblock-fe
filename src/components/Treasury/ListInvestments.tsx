import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Typography, TypographyProps, Grid } from '@mui/material';
import { formatCapitalizeLetters } from 'helpers/formatCapitalizeLetters';
import { formatNumberWithComas, formatPrice, truncateNumber } from 'helpers/formatPrice';
import PaginationCustom from 'components/Base/Pagination';
import Skeleton from '@mui/material/Skeleton';
import { useAppSelector } from 'stores/hooks';
import { range } from 'lodash';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { computeProfitAndLoss } from '../../helpers/computeProfitAndLoss';
import PriceUp from '../../assets/images/price-up.svg';
import PriceDown from '../../assets/images/price-down.svg';

interface Props {
  data: Array<any>;
}

interface TextUnitProps {
  status: 'increase' | 'decrease';
}

const Wrapper = styled(Box)<BoxProps>(() => ({
  width: '100%',
}));

const InvestmentItem = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  padding: '1px',
  boxSizing: 'border-box',
  borderRadius: '14px',
  overflow: 'hidden',
  marginBottom: '10px',
  background:
    theme.palette.mode === 'light'
      ? ' #FFFFFF'
      : `linear-gradient(136.53deg, rgba(255, 255, 255, 0.1258) 1.5%, 
        rgba(255, 255, 255, 0) 48.05%, rgba(255, 255, 255, 0.1739) 107.89%)`,
}));

const BoxContent = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  background: theme.palette.mode === 'light' ? ' #FFFFFF' : '#252525',
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.1)',
  borderRadius: '14px',
  padding: '21px 19px 24px 23px',
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 'normal',
  fontSize: '12px',
  lineHeight: '14px',
  color: theme.palette.mode === 'light' ? '#BDBDBD' : '#4F4F4F',
  marginBottom: '2px',
}));

const ViewIcon = styled('img')(() => ({
  width: '21px',
  height: '21px',
  marginRight: '7px',
  borderRadius: '100%',
}));

const TextCenter = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'Poppins',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '21px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
}));

const TextUnit = styled(Typography)<TextUnitProps>(() => ({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '21px',
  marginRight: '4px',
}));

const TextNoData = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 'normal',
  fontSize: '20px',
  lineHeight: '23px',
  textAlign: 'center',
  color: theme.palette.mode === 'light' ? '#4F4F4F' : '#6B6B6B',
  width: '100%',
  height: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80px',
  background: theme.palette.mode === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
  borderRadius: '22px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '18px',
    lineHeight: '22px',
    // minHeight: '400px',
  },
  [theme.breakpoints.down('md')]: {
    // minHeight: '200px',
  },
  [theme.breakpoints.down('sm')]: {
    // minHeight: '80px',
    background: theme.palette.mode === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
    boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
    borderRadius: '22px',
  },
}));

const ViewPagination = styled(Box)<BoxProps>(() => ({
  width: '100%',
  textAlign: 'right',
  margin: '36px 0px 27px 0px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  'nav > ul': {
    display: 'inline-flex',
  },
}));

const TextProfitPercent = styled('span')<any>(({ color }) => ({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '12px',
  color: color,
}));

const ImgPrice = styled('img')<any>(({}) => ({
  width: '11px',
  height: '11px',
  objectFit: 'contain',
  marginRight: '5px',
}));

const ListSkeleton: React.FC = () => {
  return (
    <InvestmentItem>
      <BoxContent>
        <Grid container spacing={'14px'}>
          <Grid item xs={5}>
            <Title>Token Name</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="circular" width={26} height={26} />
              <Skeleton animation="wave" width={'70%'} />
            </div>
          </Grid>
          <Grid item xs={7}>
            <Title>Our Investment (USD)</Title>
            <Skeleton animation="wave" height={26} />
          </Grid>

          <Grid item xs={5}>
            <Title>Current Token Price</Title>
            <Skeleton animation="wave" height={26} />
          </Grid>
          <Grid item xs={7}>
            <Title>Initial Investment (USD)</Title>
            <Skeleton animation="wave" height={26} />
          </Grid>

          <Grid item xs={5}>
            <Title>Our Holdings</Title>
            <Skeleton animation="wave" height={26} />
          </Grid>
          <Grid item xs={7}>
            <Title>Current investment value (USD)</Title>
            <Skeleton animation="wave" height={26} />
          </Grid>
        </Grid>
      </BoxContent>
    </InvestmentItem>
  );
};

const ListInvestments: React.FC<Props> = ({ data }) => {
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
          {range(rowsPerPage).map((i) => (
            <ListSkeleton key={i} />
          ))}
        </Wrapper>
      </Box>
    );
  }

  return (
    <Box>
      <Wrapper>
        {data.length > 0 && (
          <ViewPagination>
            <PaginationCustom total={data.length} limit={rowsPerPage} page={page + 1} onChange={handleChangePage} />
          </ViewPagination>
        )}

        {data.length > 0 ? (
          (rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map((item, i) => (
            <InvestmentItem key={i}>
              <BoxContent>
                <Grid container spacing={'14px'}>
                  <Grid item xs={5}>
                    <Title>Token Name</Title>
                    <TextCenter>
                      <ViewIcon alt="icon token" src={item.icon} />
                      {formatCapitalizeLetters(item.name)}
                    </TextCenter>
                  </Grid>
                  <Grid item xs={7}>
                    <Title>Our Investment (USD)</Title>
                    {renderContent(item.initial, item.status)}
                  </Grid>

                  <Grid item xs={5}>
                    <Title>Current Token Price</Title>
                    {renderContent(item.token_price, item.status)}
                  </Grid>
                  <Grid item xs={7}>
                    <Title>Average Buying Price (USD)</Title>
                    {renderContent(item.avg_buy_price, item.status)}
                  </Grid>

                  <Grid item xs={5}>
                    <Title>Our Holdings</Title>
                    <TextCenter>
                      {formatForNumberLessThanCondition({
                        value: item.our_holdings,
                        minValueCondition: 0.01,
                        callback: formatPrice,
                      })}
                    </TextCenter>
                  </Grid>
                  <Grid item xs={7}>
                    <Title>Current investment value (USD)</Title>
                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'} sx={{ width: '100%' }}>
                      <Box>{renderContent(item.current_investment, item.status)}</Box>

                      <Box sx={{ margin: '0 10px' }}>
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
                  </Grid>
                </Grid>
              </BoxContent>
            </InvestmentItem>
          ))
        ) : (
          <TextNoData>No investments yet!</TextNoData>
        )}
      </Wrapper>
    </Box>
  );
};

export default ListInvestments;
