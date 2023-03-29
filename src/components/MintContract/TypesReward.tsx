import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useWindowSize } from 'hooks/useWindowSize';
import { Box, BoxProps, Typography, TypographyProps } from '@mui/material';
import TypeReward from './TypeReward';
import {
  SquareIcon,
  CubeIcon,
  TessIcon,
  SquareDarkDefaultIcon,
  CubeDarkDefaultIcon,
  TessDarkDefaultIcon,
} from 'assets/images';
import { useAppSelector } from 'stores/hooks';
import { computeEarnedTokenPerDay } from 'helpers/computeEarnedTokenPerDay';

interface Props {
  title?: string;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  marginTop: '35px',
  boxSizing: 'border-box',

  [theme.breakpoints.down('sm')]: {
    padding: '0 14px',
  },
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  textAlign: 'center',
  fontSize: '24px',
  lineHeight: '44px',
  color: theme.palette.mode === 'light' ? '#293247' : '#BDBDBD',
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontFamily: 'Poppins',
  margin: '0 0 41px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '20px',
    lineHeight: '32px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '21px',
    lineHeight: '31px',
  },
}));

const TypesReward: React.FC<Props> = () => {
  const theme = useTheme();
  const [width] = useWindowSize();
  const dataApy = useAppSelector((state) => state.contract.apy);
  const dataPrice = useAppSelector((state) => state.contract.price);
  const isCreatingSquareContracts = useAppSelector((state) => state.contract.isCreatingSquareContracts);
  const isCreatingCubeContracts = useAppSelector((state) => state.contract.isCreatingCubeContracts);
  const isCreatingTesseractContracts = useAppSelector((state) => state.contract.isCreatingTesseractContracts);
  const isCreatingContracts = isCreatingSquareContracts || isCreatingCubeContracts || isCreatingTesseractContracts;
  return (
    <Wrapper>
      <Title>Types of Reward Contracts</Title>

      <TypeReward
        id={0}
        name="Square Contract"
        icon={theme.palette.mode === 'light' ? SquareIcon : SquareDarkDefaultIcon}
        color={theme.palette.mode === 'light' ? '#E5E5FE' : '#327DD2'}
        colorChart={theme.palette.mode === 'light' ? '#4F49DD' : width < 600 ? '#4F49DD' : ' #4F49DD'}
        value={dataPrice.square}
        apy={dataApy.square}
        earn={computeEarnedTokenPerDay(dataPrice.square, dataApy.square)}
        loading={isCreatingSquareContracts}
        isCreatingContracts={isCreatingContracts}
      />
      <TypeReward
        id={1}
        name="Cube Contract"
        icon={theme.palette.mode === 'light' ? CubeIcon : CubeDarkDefaultIcon}
        color={theme.palette.mode === 'light' ? '#D2FFDB' : '#2B91CF'}
        // colorChart="#9DE6AB"
        colorChart={theme.palette.mode === 'light' ? '#5EF87A' : width < 600 ? '#5EF87A' : '#5EF87A'}
        value={dataPrice.cube}
        apy={dataApy.cube}
        earn={computeEarnedTokenPerDay(dataPrice.cube, dataApy.cube)}
        loading={isCreatingCubeContracts}
        isCreatingContracts={isCreatingContracts}
        help={true}
      />
      <TypeReward
        id={2}
        name="Tesseract Contract"
        icon={theme.palette.mode === 'light' ? TessIcon : TessDarkDefaultIcon}
        color={
          theme.palette.mode === 'light' ? '#DBECFD' : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)'
        }
        // colorChart="#9EC5EB"
        colorChart={theme.palette.mode === 'light' ? '#4092E7' : width < 600 ? '#4092E7' : '#4092E7'}
        value={dataPrice.tesseract}
        apy={dataApy.tesseract}
        earn={computeEarnedTokenPerDay(dataPrice.tesseract, dataApy.tesseract)}
        loading={isCreatingTesseractContracts}
        isCreatingContracts={isCreatingContracts}
        help={true}
      />
    </Wrapper>
  );
};

export default TypesReward;
