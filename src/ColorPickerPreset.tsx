import React from 'react';
import styled from 'styled-components';

import { Mode, Color, options } from './brains/colors';
import { Chance, CommandSingleColorExt, Time } from './brains/pixmob';

type ColorProps = {
  color: string;
  selectedColor: string | undefined;
};

const ColorOption = styled.div<ColorProps>`
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
  selectedColor: Color | undefined;
  selectColor: (mode: Mode, color: Color) => void;
};

const ColorPicker = ({ selectedColor, selectColor }: ColorPickerProps) => {
  const colors = options['solid'];
  const color = new CommandSingleColorExt({
    red: 255,
    green: 255,
    blue: 0,
    chance: Chance.CHANCE_100_PCT,
    attack: Time.TIME_960_MS,
    sustain: Time.TIME_960_MS,
    release: Time.TIME_960_MS,
    enableRepeat: true,
  });
  console.log(color.encode());
  return (
    <>
      <ColorsContainer>
        {colors.map((color) =>
          <ColorOption key={color.hex} color={color.hex} selectedColor={selectedColor?.hex}
            onClick={() => selectColor(Mode.ONCE, color)} />)}
      </ColorsContainer>
    </>
  );
};

export default ColorPicker;
