import React from 'react';
import { styled } from '@mui/material/styles';

import { Pagination, PaginationProps } from '@mui/material';

interface Props {
  total: number;
  page: number;
  limit: number;
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
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '24px',
        textAlign: 'center',
        color: theme.palette.mode === 'light' ? ' #293247' : '#fff',
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
        color: theme.palette.mode === 'light' ? '#4F4F4F' : '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '24px',
        '&:hover': {
          background: 'none',
        },
        '&:active': {
          background: theme.palette.mode === 'light' ? '#F3F4F6' : '#4A4B4E',
          color: '#fff',
        },
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
        color: theme.palette.mode === 'light' ? ' #293247' : '#fff',
        margin: '0 5px',
        background: 'none',

        '@media (max-width: 375px)': {
          margin: 0,
        },
      },

      '.Mui-selected': {
        fontFamily: 'Poppins',
        background: theme.palette.mode === 'light' ? '#F3F4F6 !important' : '#4A4B4E !important',
        color: theme.palette.mode === 'light' ? '#293247' : '#fff',
        fontWeight: '400',
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

  return <Wrapper count={count} page={page} onChange={handleChange} siblingCount={0} />;
};

export default PaginationCustom;
