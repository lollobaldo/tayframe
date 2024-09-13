import React, { useState } from 'react';
import styled from 'styled-components';
import { hsvaToHex, hsvaToRgba, RgbColor } from '@uiw/color-convert';

import Slider from './bits/Slider';
import ColorPicker from './bits/ColorPicker';
import Button from './bits/Button';
import { ColorPickersProps } from './ColorPickers';
import Switch from './bits/Switch';

import { Command, CommandSetColor, CommandSetConfig, CommandSetOffReset, CommandSingleColorExt, Time } from './brains/pixmob';

const Container = styled.div`
  height: 100%;
  padding: 64px;
  padding-top: 32px;
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

const AdvancedPicker = ({ sendCommands }: ColorPickersProps) => {
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [hold, setHold] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [length, setLength] = useState(4);
  const [fadeIn, setFadeIn] = useState(5);
  const [fadeOut, setFadeOut] = useState(3);

  const reset = () => {
    sendCommands([new CommandSetOffReset({ nreset: true })]);
  };

  const singleColorCommands = ({ r, g, b }: RgbColor) => {
    return [
      new CommandSingleColorExt({
        red: r, green: g, blue: b,
        attack: fadeIn, sustain: length, release: fadeOut,
      }),
    ]
  };

  const holdColorCommands = ({ r, g, b }: RgbColor) => {
    return [
      new CommandSetColor({ red: r, green: g, blue: b, profileId: 0, skipDisplay: true }),
      new CommandSetConfig({
        onStart: true, gstEnable: true,
        profileIdLo: 0, profileIdHi: 0, isRandom: false,
        attack: Time.TIME_960_MS, sustain: Time.TIME_960_MS, release: Time.TIME_0_MS
      }),
    ]
  };

  const repeatColorCommands = ({ r, g, b }: RgbColor) => {
    return [
      new CommandSetColor({ red: r, green: g, blue: b, profileId: 0, skipDisplay: true }),
      new CommandSetConfig({
        onStart: true, gstEnable: true,
        profileIdLo: 0, profileIdHi: 0, isRandom: false,
        attack: fadeIn, sustain: length, release: fadeOut,
      }),
    ]
  };

  const send = () => {
    const rgb = hsvaToRgba(hsva);
    let commands: Command[] = singleColorCommands(rgb);
    if(hold) commands = holdColorCommands(rgb);
    if(repeat) commands = repeatColorCommands(rgb);

    sendCommands(commands, hsvaToHex(hsva));
  };

  const onSetHold = (newValue: boolean) => {
    setHold(newValue);
    if (newValue) setRepeat(false);
  };

  const onSetRepeat = (newValue: boolean) => {
    setRepeat(newValue);
    if (newValue) setHold(false);
  };

  return (
    <Container>
      <ColorPicker color={hsva} onChange={(color) => setHsva({ ...hsva, ...color.hsva })} />
      <Sliders>
        <Label>Hold</Label>
        <Switch state={hold} onChange={onSetHold} color={hsva} style={{ justifySelf: 'flex-end' }} />
        <Label>Repeat</Label>
        <Switch state={repeat} onChange={onSetRepeat} color={hsva} style={{ justifySelf: 'flex-end' }} />
        <Label>Length</Label>
        <Slider color={hsva} value={length} onChange={setLength} max={6} />
        <Label>Fade In</Label>
        <Slider color={hsva} value={fadeIn} onChange={setFadeIn} />
        <Label>Fade Out</Label>
        <Slider color={hsva} value={fadeOut} onChange={setFadeOut} disabled={hold} />
      </Sliders>
      <Buttons>
        <Button $color="red" onClick={reset}>Stop</Button>
        <Button $color="green" onClick={send}>Send</Button>
      </Buttons>
    </Container>
  );
};

export default AdvancedPicker;
