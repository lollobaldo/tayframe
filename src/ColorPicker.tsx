import React from 'react';
import styled from 'styled-components';

import { ColorOption } from './brains/colors';

type ColorProps = {
  color: string;
  selectedColor: string | undefined;
};

const Color = styled.div<ColorProps>`
    background-color: ${({ color }) => color};
    width: 100px;
    height: 60px;
    border-radius: 8px;
    border: 2px solid black;
`;

const ColorsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 8px;
`;

type ColorPickerProps = {
  colors: ColorOption[];
  selectedColor: ColorOption | undefined;
  selectColor: (color: ColorOption) => void;
};


const ColorPicker = ({ colors, selectedColor, selectColor }: ColorPickerProps) => {
  return (
    <>
      {/* <button onClick={() => write(bits_to_arduino_string(red))} disabled={!isConnected}>RED</button>
      <button onClick={() => write(bits_to_arduino_string(blue))} disabled={!isConnected}>BLUE</button>
      <button onClick={() => write(bits_to_arduino_string(yellow))} disabled={!isConnected}>YELLOW</button> */}
      <ColorsContainer>
        {colors.map(({ hex }) => <Color key={hex} color={hex} selectedColor={selectedColor?.hex} />)}
      </ColorsContainer>
    </>
  );
};

export default ColorPicker;
