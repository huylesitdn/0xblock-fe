import React from 'react';
import { useWindowSize } from 'hooks/useWindowSize';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Typography, TypographyProps, Tooltip } from '@mui/material';
import { useAppSelector } from 'stores/hooks';
// import { formatPrice } from 'helpers/formatPrice';

interface Props {
  icon?: any;
  title: string;
  value: string;
  color: string;
  text?: string;
  disabled?: boolean;
  connected?: any;
  data: Array<any>;
}

interface TitleProps extends TypographyProps {
  color: string;
}

interface TitleMobileProps extends TypographyProps {
  color: string;
  connected: any;
  value: any;
  rewards: boolean | any;
}

interface ValueProps extends TypographyProps {
  color: string;
  number: string;
}

interface BoxCustomProps {
  color: string;
  opacity?: string;
  number?: string;
}

interface TypographyCustomProps extends TypographyProps {
  rewards: boolean | any;
  value: any;
  connected: any;
}

const Wrapper = styled(Box)<BoxCustomProps>(({ color, theme, opacity, number }) => ({
  background: color,
  opacity: opacity,
  padding: '20px 20px',
  borderRadius: '20px',
  boxShadow: Number(number) > 0 ? '1px 19px 22px -16px rgba(50, 71, 117, 0.18)' : 'unset',
  display: 'inline-flex',
  width: '100%',
  alignItems: 'center',
  boxSizing: 'border-box',

  [theme.breakpoints.down('lg')]: {
    padding: '12px 14px',
  },
}));

const WrapperMobile = styled(Box)<BoxCustomProps>(({ color, theme, opacity, number }) => ({
  width: '100%',
  display: 'none',
  background: color,
  padding: '16px 13px 21px 20px',
  borderRadius: '20px',
  boxShadow: Number(number) > 0 ? '0px 28px 37px -17px rgba(25, 21, 48, 0.11)' : 'unset',
  boxSizing: 'border-box',
  height: '100%',
  opacity: opacity,

  [theme.breakpoints.down('sm')]: {
    display: 'inline-block',
  },
}));

const BoxHeader = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '24px',
}));

const ViewImage = styled(Box)<BoxProps>(({ theme }) => ({
  width: '43px',
  height: '43px',
  marginRight: '10px',

  img: {
    width: '100%',
  },

  [theme.breakpoints.down('lg')]: {
    width: '30px',
    height: '30px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '58px',
    height: '58px',
    marginRight: '9px',
  },
}));

const Content = styled(Box)<BoxProps>(({ theme }) => ({
  maxWidth: 'calc(100% - 54px - 43px)',
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

const Title = styled(Typography)<TitleProps>(({ theme, color }) => ({
  fontFamily: 'Poppins',
  fontWeight: '600',
  fontSize: '20px',
  lineHeight: '30px',
  color: color === '#3F3F3F' ? '#828282' : theme.palette.mode === 'light' ? '#293247' : '#11151D',
  textTransform: 'uppercase',
  margin: '0',
  whiteSpace: 'nowrap',
  overflow: 'hidden !important',
  textOverflow: 'ellipsis',

  [theme.breakpoints.down('lg')]: {
    fontSize: '15px',
    lineHeight: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
    lineHeight: '30px',
  },
}));

const TitleMobile = styled(Typography)<TitleMobileProps>(({ theme, color, connected, rewards, value }) => ({
  fontFamily: 'Poppins',
  fontWeight: '600',
  fontSize: '20px',
  lineHeight: '30px',
  color:
    rewards && !connected
      ? '#4F4F4F'
      : color === '#3F3F3F'
      ? '#828282'
      : theme.palette.mode === 'light'
      ? '#293247'
      : Number(value) === 0 && rewards
      ? '#4F4F4F'
      : '#293247',
  // color: rewards && !connected ? '#4F4F4F' : color === '#3F3F3F' ? '#828282' : '#293247',
  textTransform: 'uppercase',
  margin: '0',
  whiteSpace: 'nowrap',
  overflow: 'hidden !important',
  textOverflow: 'ellipsis',

  [theme.breakpoints.down('lg')]: {
    fontSize: '15px',
    lineHeight: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
    lineHeight: '30px',
  },
}));

const Description = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: 'rgba(41, 50, 71, 0.35)',
  fontWeight: 'normal',
  fontFamily: 'Poppins',
  fontSize: '12px',
  lineHeight: '18px',
  textTransform: 'capitalize',
  margin: 0,

  [theme.breakpoints.down('lg')]: {
    fontSize: '10px',
    lineHeight: '14px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const Value = styled(Typography)<ValueProps>(({ theme, color, number }) => ({
  padding: '13px 18px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#fff'
      : Number(number) > 0
      ? 'rgba(255, 255, 255, 0.19)'
      : 'rgba(255, 255, 255, 0.04)',
  color: color === '#3F3F3F' ? '#828282' : theme.palette.mode === 'light' ? '#293247' : '#11151D',
  boxSizing: 'border-box',
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: '20px',
  lineHeight: '23px',
  display: 'inline-block',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  boxShadow: '0px 4px 17px rgba(0, 0, 0, 0.13)',
  borderRadius: '12px',
  // whiteSpace: 'nowrap',
  // overflow: 'hidden !important',
  // textOverflow: 'ellipsis',

  [theme.breakpoints.down('lg')]: {
    fontSize: '16px',
    lineHeight: '22px',
    padding: '8px',
    minWidth: '38px',
  },
}));

const TotalMobile = styled(Typography)<TypographyCustomProps>(({ theme, rewards, connected, value }) => ({
  color:
    rewards && !connected
      ? '#4F4F4F'
      : theme.palette.mode === 'light'
      ? '#293247'
      : Number(value) === 0 && rewards
      ? '#4F4F4F'
      : '#293247',
  boxSizing: 'border-box',
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: rewards ? '24px' : '36px',
  lineHeight: rewards ? '28px' : '42px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'inline-block',
  width: 'calc(100% - 67px)',
  whiteSpace: 'nowrap',
  overflow: 'hidden !important',
  textOverflow: 'ellipsis',
}));

const Statistic: React.FC<Props> = ({ icon, title, value, color, text, connected, data }) => {
  const [width] = useWindowSize();
  const theme = useTheme();
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const opacity =
    currentUserAddress && Number(value) > 0
      ? '1'
      : theme.palette.mode === 'light'
      ? '0.75'
      : value === '<0.001'
      ? '1'
      : '0.3';
  if (width < 600) {
    return (
      <WrapperMobile color={color} opacity={opacity} number={value}>
        <BoxHeader>
          <ViewImage>
            {title === 'Rewards' && theme.palette.mode === 'dark' && data.length === 0 ? '' : <img alt="" src={icon} />}
          </ViewImage>

          <Tooltip title={title === 'Rewards' || title === 'My Rewards' ? value : value}>
            <TotalMobile connected={connected} rewards={title === 'Rewards'} value={value}>
              {title === 'Rewards' || title === 'My Rewards' ? value : value}
            </TotalMobile>
          </Tooltip>
        </BoxHeader>

        <Content>
          <TitleMobile connected={connected} rewards={title === 'Rewards'} color={color} value={value}>
            {title}
          </TitleMobile>
          {text && <Description>{text}</Description>}
        </Content>
      </WrapperMobile>
    );
  } else {
    return (
      <Wrapper color={color} opacity={opacity} number={value}>
        {icon && (
          <ViewImage>
            <img alt="" src={icon} />
          </ViewImage>
        )}

        <Content>
          <Title color={color}>{title}</Title>
          {text && <Description>{text}</Description>}
        </Content>
        <Value number={value} color={color}>
          {value}
        </Value>
      </Wrapper>
    );
  }
};

export default Statistic;
