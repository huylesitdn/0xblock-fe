import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { useWindowSize } from 'hooks/useWindowSize';

import LightWallet from 'assets/images/light-wallet.svg';

interface Props {
  mode?: string;
  onChange: (value: any) => void;
}

interface IconButtonCustomProps {
  bgColor: string;
  hoverEnable: boolean;
}

const ButtonMode = styled(IconButton)<IconButtonCustomProps>(({ bgColor, hoverEnable }) => ({
  background: `${bgColor}!important`,
  boxShadow: '0px 12px 11px -10px rgba(0, 0, 0, 0.25)',
  boxSizing: 'border-box',
  borderRadius: '10px',
  width: '48px',
  height: '48px',
  padding: '11px',
  marginLeft: '12px',

  img: {
    width: '100%',
  },

  ['&:hover']: hoverEnable
    ? {
        opacity: '0.7',
        background: ' #DADADA',
      }
    : {},
}));

const WalletButton: React.FC<Props> = ({ onChange, mode }) => {
  const [width] = useWindowSize();
  const theme = useTheme();
  const bgColor =
    mode === 'logout' ? '#3864FF' : width < 900 ? (theme.palette.mode === 'light' ? '#E0E0E0' : '#4F4F4F') : '#E0E0E0';
  return (
    <ButtonMode onClick={onChange} bgColor={bgColor} hoverEnable={width < 900 ? false : true}>
      <img alt="" src={LightWallet} />
    </ButtonMode>
  );
};

export default WalletButton;
