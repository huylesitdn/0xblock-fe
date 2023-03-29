import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ConnectWallet from 'components/ConnectWallet';
import { useAppSelector } from 'stores/hooks';
import { formatUserAddress } from 'helpers';
import { Box, BoxProps, Link, Paper, PaperProps, Typography, TypographyProps } from '@mui/material';
import { Tw, TwActive, Discord, DiscordActive, Medium, MediumActive } from 'assets/images';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  text?: string;
  walletId?: string;
  connected?: boolean;
  isBg: boolean;
  onConnect?: () => void;
}

interface PaperCustomProps extends PaperProps {
  isBg: boolean;
}

const BannerWrapper = styled(Paper)<PaperCustomProps>(({ isBg, theme }) => ({
  boxShadow: isBg ? '0px 0px 48px rgba(0, 0, 0, 0.06)' : 'none',
  borderRadius: '22px',
  background: isBg ? (theme.palette.mode === 'light' ? '#fff' : 'rgba(255, 255, 255, 0.03)') : 'unset',
  padding: isBg ? '30px 22px 30px 33px' : 0,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  minHeight: isBg ? '119px' : '50px',

  [theme.breakpoints.down('lg')]: {
    minHeight: isBg ? '90px' : '40px',
    padding: isBg ? '16px 22px 16px 24px' : 0,
  },
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

const BoxRight = styled(Box)<BoxProps>(() => ({
  width: 'calc(50%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const Wallet = styled(Box)<BoxProps>(() => ({
  maxWidth: '126px',
  marginRight: '30px',
  overflow: 'hidden',

  span: {
    color: '#BDBDBD',
    fontFamily: 'Poppins',
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const ImgSocial = styled('img')<any>(() => ({
  width: '29px',
  height: '24px',
  objectFit: 'contain',
  margin: '0 16px',
}));

const Banner: React.FC<Props> = () => {
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const isLogin = useAppSelector((state) => state.user.isLogin);

  const [srcImg, setSrcImg] = useState({
    tw: Tw,
    discord: Discord,
    medium: Medium,
  });

  const handleHoverIcon = (key: string, action: string) => {
    if (key === 'tw') setSrcImg({ tw: action === 'over' ? TwActive : Tw, discord: Discord, medium: Medium });
    if (key === 'discord') setSrcImg({ tw: Tw, discord: action === 'over' ? DiscordActive : Discord, medium: Medium });
    if (key === 'medium') setSrcImg({ tw: Tw, discord: Discord, medium: action === 'over' ? MediumActive : Medium });
  };

  return (
    <BannerWrapper isBg={false}>
      <Box sx={{ alignSelf: 'center' }}>
        <Box>
          <Tooltip title="twitter" arrow placement="top">
            <Link
              href={'https://twitter.com/0xblockfi'}
              target={'_blank'}
              onMouseOver={() => {
                handleHoverIcon('tw', 'over');
              }}
              onMouseLeave={() => {
                handleHoverIcon('tw', 'leave');
              }}
            >
              <ImgSocial src={srcImg.tw} alt="tw icon" on />
            </Link>
          </Tooltip>

          <Tooltip title="discord" arrow placement="top">
            <Link
              href={'https://discord.com/invite/0xblock'}
              target={'_blank'}
              onMouseOver={() => {
                handleHoverIcon('discord', 'over');
              }}
              onMouseLeave={() => {
                handleHoverIcon('discord', 'leave');
              }}
            >
              <ImgSocial src={srcImg.discord} alt="Discord icon" />
            </Link>
          </Tooltip>

          <Tooltip title="medium" arrow placement="top">
            <Link
              href={'https://medium.com/@0xblockfi'}
              target={'_blank'}
              onMouseOver={() => {
                handleHoverIcon('medium', 'over');
              }}
              onMouseLeave={() => {
                handleHoverIcon('medium', 'leave');
              }}
            >
              <ImgSocial src={srcImg.medium} alt="Medium icon" />
            </Link>
          </Tooltip>
        </Box>
      </Box>

      <BoxRight>
        {currentUserAddress && isLogin && (
          <Wallet>
            <span>Wallet</span>
            <Title>{formatUserAddress(currentUserAddress)}</Title>
          </Wallet>
        )}
        <ConnectWallet />
      </BoxRight>
    </BannerWrapper>
  );
};

export default Banner;
