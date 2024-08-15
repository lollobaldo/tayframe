import React, { useState } from 'react';
import styled from 'styled-components';
import { hsvaToHex, hsvaToRgba } from '@uiw/color-convert';

import Slider from './bits/Slider';
import ColorPicker from './bits/ColorPicker';
import Button from './bits/Button';
import { ColorPickersProps } from './ColorPickers';
import Switch from './bits/Switch';

import { Command, CommandSetOffReset, CommandSetRepeatCount, CommandSingleColorExt } from './brains/pixmob';
import { Mode } from './brains/colors';

const Container = styled.div`
  height: 100%;
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
`;

const Label = styled.span`
  white-space: nowrap;
  font-size: large;
`;

const Sliders = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 16px;
`;

const SPACER = [0, 0, 0, 0, 0, 0, 0];

const AdvancedPicker = ({ onChange }: ColorPickersProps) => {
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [repeat, setRepeat] = useState(false);
  const [length, setLength] = useState(7);
  const [fadeIn, setFadeIn] = useState(7);
  const [fadeOut, setFadeOut] = useState(7);

  const sendCommands = (commands: Command[], hex = '#000000') => {
    console.log(commands);
    onChange({ hex, data: commands.flatMap(c => [...c.encode(), ...SPACER]) }, Mode.ONCE);
  };

  const reset = () => {
    sendCommands([new CommandSetOffReset({ nreset: true })]);
    sendCommands([new CommandSetRepeatCount({ repeatCount: 10 })]);
  };

  const send = () => {
    const { r, g, b } = hsvaToRgba(hsva);
    const commands = [
      new CommandSetRepeatCount({ repeatCount: 3 }),
      new CommandSingleColorExt({
        red: r, green: g, blue: b,
        attack: fadeIn,
        sustain: length,
        release: fadeOut,
        enableRepeat: repeat,
      }),
    ];
    sendCommands(commands, hsvaToHex(hsva));
  };

  return (
    <Container>
      <ColorPicker color={hsva} onChange={(color) => setHsva({ ...hsva, ...color.hsva })} />
      <Sliders>
        <Label>Repeat</Label>
        <Switch state={repeat} onChange={setRepeat} color={hsva} style={{ justifySelf: 'flex-end' }} />
        <Label>Length</Label>
        <Slider color={hsva} value={length} onChange={setLength} />
        <Label>Fade In</Label>
        <Slider color={hsva} value={fadeIn} onChange={setFadeIn} />
        <Label>Fade Out</Label>
        <Slider color={hsva} value={fadeOut} onChange={setFadeOut} />
      </Sliders>
      <Buttons>
        <Button $color="red" onClick={reset}>Reset</Button>
        <Button $color="green" onClick={send}>Send</Button>
      </Buttons>
    </Container>
  );
};

export default AdvancedPicker;
