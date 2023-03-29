import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Typography, TypographyProps } from '@mui/material';

import EmptyIcon from 'assets/images/empty-zap.svg';
import EmptyDarkIcon from 'assets/images/empty-zap-dark.svg';
// import EmptyLinkIcon from 'assets/images/empty-link.svg';

interface Props {
  title?: string;
  mode?: 'white' | 'mixed';
}

const Wrapper = styled(Box)<BoxProps>(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const EmptyContent = styled(Box)<BoxProps>(() => ({}));

const ViewImg = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  justifyContent: 'center',
}));
const Text = styled(Typography)<TypographyProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '18px',
  lineHeight: '33px',
  textAlign: 'center',
  letterSpacing: '0.04em',
  color: '#9CA0AC',
  maxWidth: '321px',
  marginTop: '27px',
}));

const Empty: React.FC<Props> = ({ title = 'You need to connect your wallet to use ZAP feature.', mode = 'mixed' }) => {
  const theme = useTheme();

  return (
    <Wrapper>
      <EmptyContent>
        <ViewImg>
          <img
            alt=""
            src={theme.palette.mode === 'light' ? EmptyIcon : mode === 'mixed' ? EmptyDarkIcon : EmptyIcon}
            width={264}
          />
        </ViewImg>
        <Text variant="body1">{title}</Text>
      </EmptyContent>
    </Wrapper>
  );
};

export default Empty;
