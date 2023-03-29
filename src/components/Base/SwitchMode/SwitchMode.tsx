import React from 'react';
import { useWindowSize } from 'hooks/useWindowSize';
import { styled, useTheme } from '@mui/material/styles';
import { IconButton, IconButtonProps } from '@mui/material';

import MySwitch from 'components/Base/Switch';

import LightSun from 'assets/images/light-sun.svg';
import DarkSun from 'assets/images/dark-moon.svg';

interface Props {
  mode: 'light' | 'dark';
  onChange: (value: any) => void;
}

const ButtonMode = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  border: `1px solid${theme.palette.mode === 'light' ? ' #3864FF' : '#fff'}`,
  boxSizing: 'border-box',
  boxShadow: '0px 12px 11px -10px rgba(0, 0, 0, 0.25)',
  borderRadius: '10px',
  width: '48px',
  height: '48px',
  padding: '11px',
  color: theme.palette.mode === 'light' ? ' #3864FF' : '#fff',

  img: {
    width: '100%',
  },
}));

const SwitchMode: React.FC<Props> = ({ mode, onChange }) => {
  const [width] = useWindowSize();
  const theme = useTheme();

  if (width < 900) {
    return (
      <ButtonMode onClick={onChange}>
        <img alt="" src={theme.palette.mode === 'light' ? LightSun : DarkSun} />
      </ButtonMode>
    );
  } else {
    return <MySwitch checked={mode === 'light' ? true : false} onChange={onChange} />;
  }
};

export default SwitchMode;
