import React, { useState } from 'react';
import styled from 'styled-components';
import AdvancedPicker from './AdvancedPicker';
import { Sliders, Tab, Tabs } from './bits/Tabs';
import PresetsPicker from './PresetsPicker';
import { Command } from './brains/pixmob';
import { HexColor } from '@uiw/color-convert';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 8px;
`;

export interface ColorPickersProps {
  sendCommands: (commands: Command[], hex?: HexColor | string) => void;
}

const ColorPickers = ({ sendCommands }: ColorPickersProps) => {
  const [focusedIdx, setFocusedIdx] = useState(1);

  return (
    <Container>
      <Tabs focusedIdx={focusedIdx} onChange={setFocusedIdx}>
        <Tab title="Presets" />
        <Tab title="Custom" />
      </Tabs>
      <Sliders focusedIdx={focusedIdx}>
        <PresetsPicker sendCommands={sendCommands} />
        <AdvancedPicker sendCommands={sendCommands} />
      </Sliders>
    </Container>
  );
};

export default ColorPickers;
