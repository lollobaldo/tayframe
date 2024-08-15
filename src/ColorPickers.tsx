import React from 'react';
import styled from 'styled-components';
import AdvancedPicker from './AdvancedPicker';
import { Color, Mode } from './brains/colors';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 8px;
`;

export interface ColorPickersProps {
  onChange: (color: Color, mode: Mode) => void;
}

const ColorPickers = ({ onChange }: ColorPickersProps) => {
  return (
    <Container>
      <AdvancedPicker onChange={onChange} />
    </Container>
  );
};

export default ColorPickers;
