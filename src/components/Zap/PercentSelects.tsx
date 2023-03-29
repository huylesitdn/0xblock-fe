import { Box, BoxProps, Button, ButtonProps, styled } from '@mui/material';
import React from 'react';
const Wrapper = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  marginTop: '20px',
}));

const PercentBox = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  width: '80%',
  maxWidth: '325px',
  justifyContent: 'space-between',
}));

const PercentItem = styled(Button)<ButtonProps>(({ theme }) => ({
  height: '37px',
  width: '65px',
  border: '1px solid #3864FF',
  borderRadius: '10px',
  background: theme.palette.mode === 'dark' ? '#36549d' : '#C5D6FF',
  cursor: 'pointer',
  color: theme.palette.mode === 'dark' ? '#ffff' : '#111',
  '&:hover': {
    background: theme.palette.mode === 'dark' ? '#36549d' : '#C5D6FF',
  },
}));

interface Props {
  onChange: (value: number) => void;
}

const PercentSelects = ({ onChange }: Props) => {
  return (
    <Wrapper>
      <PercentBox>
        <PercentItem onClick={() => onChange(25)}>25%</PercentItem>
        <PercentItem onClick={() => onChange(50)}>50%</PercentItem>
        <PercentItem onClick={() => onChange(75)}>75%</PercentItem>
        <PercentItem onClick={() => onChange(100)}>Max</PercentItem>
      </PercentBox>
    </Wrapper>
  );
};
export default PercentSelects;
