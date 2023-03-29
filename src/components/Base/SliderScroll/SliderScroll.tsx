import React from 'react';
import { styled } from '@mui/material/styles';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

interface Props {
  children: React.ReactNode;
  elRef: any;
  settings: object;
}

const SliderCustom = styled(Slider)`
  display: none;
  width: 100%;

  @media (max-width: 900px) {
    display: block;
  }
`;

const SliderScroll: React.FC<Props> = ({ elRef, children, settings }) => {
  return (
    // @ts-ignore
    <SliderCustom {...settings} ref={elRef}>
      {children as any}
    </SliderCustom>
  );
};

export default SliderScroll;
