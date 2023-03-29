import React from 'react';
import { styled } from '@mui/material/styles';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  Typography,
  TypographyProps,
  ButtonProps,
  Button,
} from '@mui/material';

import { swapInputRegex } from 'consts/swap';
import BigNumber from 'bignumber.js';

interface Props {
  name: string;
  isMax: boolean;
  onMax: () => void;
  value: string | null;
  max?: number;
  min?: number;
  onChange: (event: { value: string; name: string; isOnblur?: boolean }) => void;
  disabled: boolean;
}
BigNumber.config({
  EXPONENTIAL_AT: 100,
});
const TextFieldSwap = styled(TextField)<TextFieldProps>(({ theme }) => ({
  borderRadius: '9px',

  input: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '33px',
    textAlign: 'right',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    borderRadius: '9px',

    '&:placeholder': {
      color: theme.palette.mode === 'light' ? '#BEBFCF' : '#BEBFCF',
    },

    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  '& label.Mui-focused': {
    color: 'rgba(56, 100, 255, 0.26)',
  },

  '& .MuiOutlinedInput-root': {
    background: theme.palette.mode === 'light' ? '#F9FAFF' : '#252525',

    '& fieldset': {
      borderColor: 'rgba(56, 100, 255, 0.26)',
      borderRadius: '9px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(56, 100, 255, 0.26)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(56, 100, 255, 0.26)',
    },
  },
}));

const Text = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '30px',
  letterSpacing: '0.04em',
  textTransform: 'capitalize',
  color: theme.palette.mode === 'light' ? '#293247' : '#fffff',
  borderRight: '1px solid rgba(56, 100, 255, 0.2)',
  paddingRight: '14px',
  marginRight: '9px',
}));

const ButtonMax = styled(Button)<ButtonProps>(({ theme }) => ({
  background: theme.palette.mode === 'light' ? '#E9EDFF' : '#171717',
  borderRadius: '6px',
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '26px',
  letterSpacing: '0.04em',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  padding: '0px',
  minWidth: '51px',

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '22px',
    minWidth: '47px',
  },
}));

const InputLP: React.FC<Props> = ({ name, value, max, min, onChange, disabled, isMax, onMax }) => {
  return (
    <TextFieldSwap
      autoComplete="off"
      placeholder="0.0000"
      type="text"
      name={name}
      fullWidth
      value={value}
      disabled={disabled}
      onBlur={(event) => {
        if (swapInputRegex.test(event.target.value)) {
          onChange({
            value: event.target.value !== '' ? new BigNumber(event.target.value).toString() : '',
            name: event.target.name,
            isOnblur: true,
          });
        }
      }}
      onChange={(event) => {
        if (swapInputRegex.test(event.target.value)) {
          onChange({
            value: event.target.value,
            name: event.target.name,
          });
        }
      }}
      InputProps={{
        inputProps: {
          max: max,
          min: min,
        },
        startAdornment: (
          <InputAdornment position="start">
            <Text>LP</Text>
            {isMax && <ButtonMax onClick={onMax}>Max</ButtonMax>}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default InputLP;
