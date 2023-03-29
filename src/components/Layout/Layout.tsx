import React, { useEffect } from 'react';
import 'styles/menus.css';
import { styled, Theme, CSSObject, useTheme } from '@mui/material/styles';
import { Link, LinkProps, useHistory, useLocation } from 'react-router-dom';
import { menus } from './menus';
import { ColorModeContext } from 'theme';
import { useWindowSize } from 'hooks/useWindowSize';
import MuiDrawer from '@mui/material/Drawer';
import { BoxProps } from '@mui/material/Box';
import {
  Box,
  IconButton,
  Button,
  ButtonProps,
  List,
  ListProps,
  ListItem,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
  ListItemIcon,
  ListItemIconProps,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';

// import MySwitch from 'components/Base/Switch';
import SwitchMode from 'components/Base/SwitchMode';
import Banner from 'components/Base/Banner';
import Header from './Header';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import LogoImg from 'assets/images/logo.svg';
// import LogoIcon from 'assets/images/logo-ic.svg';
import LogoDarkImg from 'assets/images/logo-dark.svg';
import RefreshLightIcon from 'assets/images/load-light.svg';
import RefreshWhiteIcon from 'assets/images/foundation_refresh.svg';
import ImportTokenIcon from 'assets/images/bx_import.svg';
import ImportTokenDarkIcon from 'assets/images/bx_dark_import.svg';
// import ImportTokenIcon from 'assets/images/import-token.svg';
// import ImportTokenDarkIcon from 'assets/images/import-token-dark.svg';
import useFetchInforContract from 'hooks/useFetchInforContract';

import { addAssets } from 'helpers/addAssets';
import { useAppSelector } from 'stores/hooks';
import { useCheckEthereumResponse } from 'hooks/useCheckEthereumResponse';
import { useWindowClose } from 'hooks/useWindowClose';
import { useLoadPairInfo } from 'hooks/swap/useLoadPairInfo';
import { useLoadLiquidityPoolData } from 'hooks/zap';
import { useFetchPoolsInfo, useFetchTotalStakingPool } from 'hooks/staking';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface Props {
  name?: string;
  children: React.ReactChild;
}

interface MainLayoutProps extends BoxProps {
  open: boolean;
}

interface ListItemCustomProps extends ListItemProps {
  active: boolean;
  open: boolean;
}

interface ListItemIconCustomProps extends ListItemIconProps {
  open: boolean;
}

interface ListCustomProps extends ListProps {
  open: boolean;
}

interface BoxMenuProps extends BoxProps {
  active: boolean;
}

interface ListItemTextCustomProps extends ListItemTextProps {
  open: boolean;
}

interface LogoProps extends LinkProps {
  open: boolean;
}

interface BoxPropsAction extends BoxProps {
  open: boolean;
}

interface ButtonRefreshProps extends ButtonProps {
  open: boolean;
}

const drawerWidth = 224;
const drawerWidthMinus = 100;
const transition = 'width 0.8s ease-in-out';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,

  transition: transition,
  background: theme.palette.mode === 'dark' ? '#171717' : '#fff',
  overflow: 'unset',
  border: 'none',
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: transition,
  border: 'none',
  overflow: 'unset',
  // width: `calc(${theme.spacing(7)} + 1px)`,
  width: drawerWidthMinus,
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
  [theme.breakpoints.up('sm')]: {
    width: drawerWidthMinus,
    // width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled('div')<any>(({ open }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: open ? '38px 34px' : '38px 31px',
  position: 'relative',
  marginBottom: '22px',
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  width: '18px',
  height: '18px',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.primary.light
      : `linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)`,
  borderRadius: '50%',
  zIndex: 200,
  position: 'absolute',
  right: '-9px',
  color: '#fff',
  fontSize: '10px',
  padding: '2px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',

  svg: {
    width: '16px',
  },

  '&:hover': {
    backgroundColor: `${theme.palette.primary.light}`,
    color: '#fff',
  },
}));

const Logo = styled(Link)<LogoProps>(({ open }) => ({
  display: 'inline-flex',
  width: open ? '155px' : '50px',
  alignItem: 'center',
  justifyContent: 'flex-start',
  overflow: 'hidden',
  transition: transition,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const MenuCustom = styled(ListItem)<ListItemCustomProps>(({ active, open, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 18px',
  borderRadius: '14px',
  textTransform: 'capitalize',
  marginBottom: '10px',
  height: '56px',
  // overflow: 'hidden',
  backgroundColor: active ? (theme.palette.mode === 'light' ? '#dbecfd88' : '#212121') : 'unset',
  width: `${open ? '100%' : '56px'}`,

  span: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '26px',
    fontFamily: 'Poppins',
    fontWeight: active ? 'bold' : 'normal',
    color: active
      ? theme.palette.mode === 'light'
        ? '#293247'
        : '#fff'
      : theme.palette.mode === 'light'
      ? '#A4A9B7'
      : 'rgba(164, 169, 183, 0.56)',
  },

  svg: {
    marginRight: '13px',
    fontSize: '24px',
  },

  '&:hover': {
    cursor: 'pointer',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    fontWeight: 'bold',
    background: theme.palette.mode === 'light' ? '#dbecfd88' : '#2121217d',
    // opacity: 0.8,
  },
}));

const SideMenus = styled(List)<ListCustomProps>(({ open, theme }) => ({
  padding: `0 ${open ? 16 : 22}px`,

  [theme.breakpoints.down('md')]: {
    // display: 'none',
  },
}));

const MenuIconCustom = styled(ListItemIcon)<ListItemIconCustomProps>(({ open }) => ({
  minWidth: 'auto',

  img: {
    width: '24px',
    height: '24px',
    marginRight: open ? '13px' : '0',
  },
}));

const MainLayout = styled(Box)<MainLayoutProps>(({ open, theme }) => ({
  background: theme.palette.mode === 'light' ? '#FAFBFE' : '#1e1e1e',
  // width: '100%',
  minHeight: '100vh',
  padding: '25px 30px',
  boxSizing: 'border-box',
  width: `calc(100% - ${open ? drawerWidth : drawerWidthMinus}px)`,
  // height: '100vh',
  transition: transition,

  [theme.breakpoints.down('lg')]: {
    padding: '24px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '96px 24px 24px',
    width: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '96px 0 24px',
    width: '100%',
  },
}));

const SideAction = styled(Box)<BoxProps>(() => ({
  marginTop: 'auto',
  marginBottom: '25px',
  textAlign: 'center',
}));

const ButtonRefresh = styled(Button)<ButtonProps>(({ theme }) => ({
  textTransform: 'none',
  fontWeight: '700',
  fontFamily: 'Poppins',
  color: theme.palette.primary[theme.palette.mode],
  borderColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.43)',
  padding: '6px 35px',
  borderRadius: '8px',
  marginBottom: '20px',
  fontSize: '14px',
  lineHeight: '21px',
  width: '152px',

  '&:hover': {
    color: theme.palette.primary[theme.palette.mode],
    borderColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.43)',
    opacity: 0.7,
  },
}));

// const ButtonBuy = styled(Button)<ButtonProps>(({ theme }) => ({
//   textTransform: 'none',
//   fontWeight: '700',
//   fontFamily: 'Poppins',
//   color: '#fff',
//   background: theme.palette.mode === 'light' ? '#3864FF' :
// 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',
//   borderColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.43)',
//   padding: '8px 35px',
//   borderRadius: '8px',
//   marginBottom: '20px',
//   fontSize: '14px',
//   lineHeight: '21px',
//   width: '152px',

//   '&:hover': {
//     background:
//       theme.palette.mode === 'light' ? '#3864FF' : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',
//     borderColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.43)',
//     opacity: 0.7,
//   },
// }));

const ButtonIconAdd = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.primary[theme.palette.mode],
  marginBottom: '20px',
  minWidth: '34px',
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  padding: '10px',

  img: {
    width: '18px',
  },

  '.addImg': {
    width: '18px',
  },

  '&:disabled': {
    borderColor: '#808080',
  },
}));

const ButtonIconRefresh = styled(Button)<ButtonRefreshProps>(({ theme, open }) => ({
  color: '#fff',
  background:
    theme.palette.mode === 'light'
      ? open
        ? '#3864FF'
        : 'none'
      : open
      ? 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)'
      : 'none',
  minWidth: '30px',
  width: open ? '30px' : '34px',
  height: open ? '30px' : '34px',
  borderRadius: open ? '50%' : '10px',
  padding: open ? '4px' : '10px',
  marginBottom: open ? '0px' : '20px',

  img: {
    width: open ? '20px' : '18px',
  },

  '&:hover': {
    color: '#fff',
    background:
      theme.palette.mode === 'light'
        ? open
          ? '#3864FF'
          : 'none'
        : open
        ? 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)'
        : 'none',
  },
}));

const BoxSwitch = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  label: {
    fontSize: '10px',
    color: theme.palette.mode === 'dark' ? '#A4A9B7' : '#A4A9B7',
    lineHeight: '18px',
    textTransform: 'capitalize',
    fontFamily: 'Poppins',
  },
}));

const TooltipCustom = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    background: '#3864FF',
    color: '#fff',
    padding: '11px 26px',
    fontFamily: 'Poppins',
    fontSize: '14px',
    lineHeight: '26px',
    fontWeight: 'bold',
    boxShadow: '1px 5px 29px rgba(50, 71, 117, 0.2)',
    borderRadius: '18px',
    left: '15px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#3864FF',
  },

  [theme.breakpoints.down('lg')]: {
    [`& .${tooltipClasses.tooltip}`]: {
      padding: '8px 20px',
      fontSize: '12px',
      lineHeight: '22px',
      borderRadius: '10px',
      left: '10px',
    },
  },
}));

const MenusMobile = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  marginBottom: '10px',

  [theme.breakpoints.down('md')]: {
    display: 'flex',
  },
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '14px',
  },
}));

const MenuItem = styled(Box)<BoxMenuProps>(({ active, theme }) => ({
  border: theme.palette.mode === 'light' ? `1px solid ${active ? '#3864FF' : '#A4A9B7'}` : 'unset',
  boxSizing: 'border-box',
  borderRadius: '14px',
  // background: active ? '#3864FF' : theme.palette.mode === 'light' ? 'unset' : 'rgba(255, 255, 255, 0.09)',
  // background: active ? '#3864FF' : theme.palette.mode === 'light' ? 'unset' : 'rgba(255, 255, 255, 0.09)',
  background:
    theme.palette.mode === 'light'
      ? active
        ? '#3864FF'
        : 'unset'
      : active
      ? 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)'
      : 'rgba(255, 255, 255, 0.09)',
  padding: '10px 19px',
  minWidth: '135px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  a: {
    color: active ? '#fff' : theme.palette.mode === 'light' ? '#A4A9B7' : '#fff',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '25px',
    textDecoration: 'none',
  },

  ['&:hover']: {
    opacity: '0.7',
    cursor: 'pointer',
  },
  ['&:focus']: {
    opacity: '0.7',
    cursor: 'pointer',
  },

  [theme.breakpoints.down('sm')]: {
    ['&:hover']: {
      opacity: '1',
      cursor: 'pointer',
    },
  },
}));

const LinkCustom = styled(Link)<any>(({ active }) => ({
  color: active ? '#fff' : '#A4A9B7',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '14px',
  lineHeight: '25px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: '14px',
  outline: 'none',
  width: 'auto !important',

  '&:focus': {
    outline: 'none',
  },
  '&:active': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: 'none',
  },
}));

const OtherActions = styled(Box)<BoxPropsAction>(({ open }) => ({
  display: open ? 'flex' : 'inline-block',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ListItemTextCustom = styled(ListItemText)<ListItemTextCustomProps>(({ open, theme }) => ({
  // transition: 'width 3s linear 1s',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: open ? '120px' : '0px',
  overflow: 'hidden',
}));

const Layout: React.FC<Props> = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();

  const currentUserAddress = useAppSelector((state) => state.user.account?.address);

  const [width] = useWindowSize([null, null] as unknown as number[]);
  const [open, setOpen] = React.useState(width ? (width < 1200 ? false : true) : null);
  const colorMode = React.useContext<any>(ColorModeContext);
  const { ethereumOk } = useCheckEthereumResponse();

  const handleChangeMode = () => {
    colorMode.toggleColorMode();
  };

  useEffect(() => {
    if (width) {
      if (width < 1200) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
  }, [width]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const openMenu = (url: string) => {
    history.push(url);
  };

  const handleRefresh = () => {
    window.location.reload();
  };
  useFetchTotalStakingPool();
  useFetchInforContract();
  useWindowClose();
  useLoadPairInfo();
  useLoadLiquidityPoolData();
  useFetchPoolsInfo();

  if (location.pathname === '/private-dashboard') {
    return <Box sx={{ overflow: 'hidden' }}>{children}</Box>;
  } else {
    return (
      <Box sx={{ display: 'flex', overflow: 'hidden' }}>
        {ethereumOk && (
          <>
            {width < 900 && <Header onChangeMode={handleChangeMode} />}

            {open !== null && (
              <>
                <Drawer
                  variant="permanent"
                  open={open}
                  sx={{
                    display: {
                      md: 'block',
                      xs: 'none',
                    },
                  }}
                >
                  <DrawerHeader open={open}>
                    <Logo open={open} to="/">
                      {theme.palette.mode === 'light' ? <img alt="" src={LogoImg} /> : <img alt="" src={LogoDarkImg} />}
                    </Logo>
                    <ToggleButton onClick={handleToggle}>
                      {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </ToggleButton>
                  </DrawerHeader>

                  <SideMenus open={open}>
                    {menus &&
                      menus.map((item, i) => (
                        <MenuCustom
                          key={i}
                          open={open}
                          active={location.pathname === item.path}
                          onClick={() => openMenu(item.path)}
                        >
                          <MenuIconCustom open={open}>
                            {!open ? (
                              <TooltipCustom title={item.name} arrow placement="right">
                                {location.pathname === item.path ? (
                                  <img
                                    alt=""
                                    src={theme.palette.mode === 'light' ? item.activeIcon : item.activeDarkIcon}
                                  />
                                ) : (
                                  <img alt="" src={item.icon} />
                                )}
                              </TooltipCustom>
                            ) : (
                              <>
                                {location.pathname === item.path ? (
                                  <img
                                    alt=""
                                    src={theme.palette.mode === 'light' ? item.activeIcon : item.activeDarkIcon}
                                  />
                                ) : (
                                  <img alt="" src={item.icon} />
                                )}
                              </>
                            )}
                          </MenuIconCustom>
                          <ListItemTextCustom primary={item.name} open={open} />
                        </MenuCustom>
                      ))}
                  </SideMenus>

                  <SideAction>
                    <Box>
                      {open ? (
                        <ButtonRefresh
                          onClick={addAssets}
                          variant="outlined"
                          color="primary"
                          disabled={!currentUserAddress}
                        >
                          Add 0xB
                        </ButtonRefresh>
                      ) : (
                        <TooltipCustom title="Add 0xB" arrow placement="right">
                          <ButtonIconAdd
                            onClick={addAssets}
                            variant="outlined"
                            color="primary"
                            disabled={!currentUserAddress}
                          >
                            <img
                              alt="import token icon"
                              src={currentUserAddress ? ImportTokenIcon : ImportTokenDarkIcon}
                            />
                          </ButtonIconAdd>
                        </TooltipCustom>
                      )}
                    </Box>

                    <OtherActions open={open}>
                      <TooltipCustom title="Refresh" arrow placement="right">
                        <ButtonIconRefresh open={open} onClick={handleRefresh} variant="outlined" color="primary">
                          <img alt="" src={open ? RefreshLightIcon : RefreshWhiteIcon} />
                        </ButtonIconRefresh>
                      </TooltipCustom>

                      <BoxSwitch>
                        <SwitchMode mode={theme.palette.mode} onChange={handleChangeMode} />
                      </BoxSwitch>
                    </OtherActions>
                  </SideAction>
                </Drawer>

                <MainLayout component="main" id="main" open={open}>
                  <MenusMobile>
                    <div className="scroll-area scroll-area--horizontal">
                      <div className="scroll-area__body">
                        {menus &&
                          menus.map((item, i) => (
                            <div key={i} className={`scroll-area__column item${i + 1}`}>
                              <LinkCustom active={location.pathname === item.path} to={item.path} key={i}>
                                <MenuItem active={location.pathname === item.path}>{item.name}</MenuItem>
                              </LinkCustom>
                            </div>
                          ))}
                      </div>
                    </div>
                  </MenusMobile>

                  {width > 899 && (
                    <Banner isBg={location.pathname === '/' || location.pathname === '/treasury' ? false : true} />
                  )}

                  {children}
                </MainLayout>
              </>
            )}
          </>
        )}
      </Box>
    );
  }
};

export default Layout;
