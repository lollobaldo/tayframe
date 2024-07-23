import React from 'react';
import styled from 'styled-components';

import { ColorOption, options } from './brains/colors';

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
  selectedColor: ColorOption | undefined;
  selectColor: (color: ColorOption) => void;
};


const ColorPicker = ({ selectedColor, selectColor }: ColorPickerProps) => {
  const colors = options['solid'];
  return (
    <>
      <ColorsContainer>
        {colors.map((color) =>
          <Color key={color.hex} color={color.hex} onClick={() => selectColor(color)} selectedColor={selectedColor?.hex} />)}
      </ColorsContainer>
    </>
  );
};

export default ColorPicker;
