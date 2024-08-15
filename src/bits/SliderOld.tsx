import React from 'react';
import { HsvaColor, hsvaToHslaString } from '@uiw/color-convert';
import Alpha, { AlphaProps } from '@uiw/react-color-alpha';

export interface SliderProps {
  color: HsvaColor;
  value: number;
  onChange?: (newValue: number) => void;
}

const TimeSlider = React.forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const { color, value, onChange } = props;
  const colorFrom = hsvaToHslaString({ ...color, a: 1, v: 100 });
  const perc = value / 255 * 100;
  return (
    <Alpha
      ref={ref}
      hsva={{ h: color.h, s: color.s, v: color.v, a: value / 255 }}
      style={{ width: '100%' }}
      radius={'20px'}
      background={`linear-gradient(to right, ${colorFrom} ${perc}%, #aaa ${perc}%)`}
      onChange={(_, interaction) => {
        onChange && onChange(interaction.left * 255);
      }}
    />
  );
});

export default TimeSlider;
