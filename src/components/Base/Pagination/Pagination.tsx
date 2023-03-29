import React from 'react';
import { styled } from '@mui/material/styles';

import { Pagination, PaginationProps } from '@mui/material';

interface Props {
  total: number;
  page: number;
  limit: number;
  // onNext: () => void
  // onPrev: () => void
  onChange: (index: number) => void;
}

const Wrapper = styled(Pagination)<PaginationProps>(({ theme }) => ({
  ul: {
    li: {
      button: {
        width: '32px',
        minWidth: '16px',
        height: '32px',
        padding: 0,
        fontFamily: 'Poppins',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        textAlign: 'center',
        color: theme.palette.mode === 'light' ? ' #A4A9B7' : '#4F4F4F',
        margin: '0 5px',
        background: 'none',
        borderRadius: '6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',

        span: {
          width: 'auto',
          height: 'auto',
          padding: 0,
        },

        '&:hover': {
          background: 'none',
        },
        '&:focus': {
          background: 'none',
        },
      },

      '.MuiPaginationItem-previousNext': {
        color: '#4F4F4F',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '24px',
        '&:hover': {
          background: 'none',
        },
        '&:active': {
          // background: 'none',
          background: '#3864FF',
          color: '#fff',
        },
      },

      '.MuiPaginationItem-previousNext.Mui-disabled': {
        display: 'none',
      },

      '.MuiPaginationItem-ellipsis': {
        width: '32px',
        minWidth: '16px',
        height: '32px',
        padding: 0,
        fontFamily: 'Poppins',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        textAlign: 'center',
        color: theme.palette.mode === 'light' ? ' #A4A9B7' : '#4F4F4F',
        margin: '0 5px',
        background: 'none',
      },

      '.Mui-selected': {
        fontFamily: 'Poppins',
        background: '#3864FF !important',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '24px',
        '&:hover': {
          background: 'none',
        },
        '&:focus': {
          background: 'none',
        },
      },
    },
  },
}));

const PaginationCustom: React.FC<Props> = ({ total, page, limit, onChange }) => {
  const count = Math.ceil(total / limit);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value);
  };

  return <Wrapper count={count} page={page} onChange={handleChange} />;
};

export default PaginationCustom;
