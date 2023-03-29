import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { useWindowSize } from 'hooks/useWindowSize';
import { Box, BoxProps } from '@mui/material';
import SwitchMode from 'components/Base/SwitchMode';
import LogoImg from 'assets/images/logo.svg';
import LogoDarkImg from 'assets/images/logo-dark.svg';
import ConnectWallet from 'components/ConnectWallet';

interface Props {
  title?: string;
  onChangeMode: () => void;
}

const WrapperHeader = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'none',
  alignItems: 'center',
  position: 'fixed',
  zIndex: '1300',
  padding: '18px 14px',
  boxSizing: 'border-box',

  [theme.breakpoints.down('md')]: {
    display: 'flex',
  },
}));

const ViewLogo = styled(Box)<BoxProps>(() => ({
  width: '136px',

  img: {
    width: '100%',
  },
}));

const Menus = styled(Box)<BoxProps>(() => ({
  marginLeft: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
}));

const Header: React.FC<Props> = ({ onChangeMode }) => {
  const theme = useTheme();
  const [width] = useWindowSize();
  const [isBackground, setIsBackground] = useState(false);

  const onScroll = () => {
    const mainElement = document.getElementById('main');
    const minHeight = width > 480 ? 30 : 10;
    if (mainElement) {
      setIsBackground(mainElement.scrollTop > minHeight ? true : false);
    }
  };

  useEffect(() => {
    const mainElement = document.getElementById('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', onScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  return (
    <WrapperHeader
      sx={{
        background: isBackground ? (theme.palette.mode === 'light' ? '#fff' : '#1E1E1E') : 'unset',
        boxShadow: isBackground
          ? theme.palette.mode === 'light'
            ? '0px 2px 5px 0px rgba(181,181,181,1)'
            : '0px 2px 5px 0px #1a1919'
          : 'unset',
      }}
    >
      <Link to="/">
        <ViewLogo>
          <img alt="" src={theme.palette.mode === 'light' ? LogoImg : LogoDarkImg} />
        </ViewLogo>
      </Link>

      <Menus>
        <SwitchMode mode="light" onChange={onChangeMode} />
        <ConnectWallet />
      </Menus>
    </WrapperHeader>
  );
};

export default Header;
