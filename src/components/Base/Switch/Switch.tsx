import * as React from 'react';
import { styled } from '@mui/system';
import SwitchUnstyled, { switchUnstyledClasses, SwitchUnstyledProps } from '@mui/base/SwitchUnstyled';

import LightIcon from 'assets/images/light.svg';
import DarkIcon from 'assets/images/dark.svg';

const blue = {
  500: '#3864FF',
};

const grey = {
  400: '#BFC7CF',
  500: '#AAB4BE',
};

const Root = styled('span')`
  font-size: 0;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
  margin: 0 10px;
  cursor: pointer;
  transform: rotate(0deg);

  &.${switchUnstyledClasses.disabled} {
    opacity: 0.4;
    cursor: not-allowed;
  }

  & .${switchUnstyledClasses.track} {
    background: #000;
    border-radius: 19px;
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
  }

  & .${switchUnstyledClasses.thumb} {
    display: block;
    width: 30px;
    height: 30px;
    top: 1px;
    left: 1px;
    border-radius: 19px;
    background: linear-gradient(141.34deg, #2978f4 28.42%, #23abf8 132.6%);
    position: relative;
    transition: 0.7s ease-in-out;
    /* background: url(${LightIcon}) no-repeat center center #fff;
    background-size: 50%; */

    &:before {
      display: 'inline-block';
      width: 14px;
      height: 14px;
      content: '';
      background: url(${DarkIcon}) no-repeat center center;
      background-size: cover;
      position: absolute;
      top: 8px;
      left: 7px;
    }
  }

  &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
    background-color: ${grey[500]};
    box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
  }

  &.${switchUnstyledClasses.checked} {
    .${switchUnstyledClasses.thumb} {
      left: 29px;
      top: 1px;
      background: #fff;
      position: relative;
      /* background: url(${LightIcon}) no-repeat center center #fff; */
      /* background-size: 50%; */

      &:before {
        display: 'inline-block';
        width: 17px;
        height: 14px;
        content: '';
        background: url(${LightIcon}) no-repeat center center;
        background-size: cover;
        position: absolute;
        top: 8px;
        right: 6px;
      }
    }

    .${switchUnstyledClasses.track} {
      background: ${blue[500]};
    }
  }

  & .${switchUnstyledClasses.input} {
    cursor: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
    margin: 0;
  }
`;

const Switch: React.FC<SwitchUnstyledProps> = ({ checked, onChange }) => {
  const label = { componentsProps: { input: { 'aria-label': 'Demo switch' } } };

  return <SwitchUnstyled checked={checked} onChange={onChange} component={Root} {...label} />;
};

export default Switch;
