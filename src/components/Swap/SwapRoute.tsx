import { Box, BoxProps, styled } from '@mui/material';
import React from 'react';

import arrowIcon from 'assets/images/arrow-right-ic.svg';
import { generateSwapRoutes } from 'helpers/swaps/generateSwapRoutes';
import { SwapTokenId } from 'hooks/swap';

const SwapRouteContainer = styled(Box)<BoxProps>({
  display: 'flex',
  justifyContent: 'center',
});

const RouteBox = styled(Box)<BoxProps>({
  display: 'flex',
  alignItems: 'center',
  height: '49px',
  maxWidth: '354px',
});

const TokenBox = styled(Box)<BoxProps>({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

const TokenName = styled(Box)<BoxProps>(({ theme }) => ({
  marginLeft: '9px',
  fontFamily: 'Poppins',
  fontSize: '16px',
  color: theme.palette.mode === 'light' ? '#293247' : 'rgba(255, 255, 255, 0.8)',
}));
const TokenIcon = styled(Box)<BoxProps>({
  height: '27px',
  width: '27px',
  '& img': {
    height: '100%',
    width: '100%',
  },
});

const Arrow = styled(Box)<BoxProps>(({ theme }) => ({
  '-webkit-mask-image': `url(${arrowIcon})`,
  maskIimage: `url(${arrowIcon})`,
  '-webkit-mask-repeat': 'no-repeat',
  maskRepeat: 'no-repeat',
  width: '6px',
  height: '20px',
  background: theme.palette.mode === 'light' ? '#293247' : 'rgba(255, 255, 255, 0.8)',
  maskPosition: 'center',
  margin: '0 20px',
  [theme.breakpoints.down('sm')]: {
    margin: '0 16px',
  },
}));

interface Props {
  fromId: SwapTokenId;
  toId: SwapTokenId;
}

export const SwapRoute = ({ fromId, toId }: Props) => {
  const route = generateSwapRoutes(fromId, toId);
  return (
    <SwapRouteContainer>
      <RouteBox>
        {route.map((item, index) => {
          return (
            <TokenBox key={item.id}>
              <TokenIcon>
                <img src={item.logo} />
              </TokenIcon>

              <TokenName>{item.id.toUpperCase()}</TokenName>
              {index < route.length - 1 && <Arrow />}
            </TokenBox>
          );
        })}
      </RouteBox>
    </SwapRouteContainer>
  );
};
