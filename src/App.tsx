import React from 'react';
import styled from 'styled-components';
import { Buffer } from 'buffer';

import './App.css';
import Header from './Header';

import { Mode } from './brains/colors';
import { useTayframeMqtt } from './brains/useTayframeMqtt';
import ConnectPage from './ConnectPage';
import { hexToBytes } from './brains/utils';
import { bits_to_arduino_string } from './brains/arduinoUtils';
import ColorPickers from './ColorPickers';
import { Command, SPACER } from './brains/pixmob';
import { HexColor } from '@uiw/color-convert';

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const { frameStatus, hasError, sendMqttData } = useTayframeMqtt();

  const sendCommands = (commands: Command[], hex: HexColor | string = '#000000') => {
    console.log(`Sending new color: ${hex}`);
    // Remove leading '#' and convert to RGB bytes
    const hexBytes = hexToBytes(hex.substring(1));
    const commandData = bits_to_arduino_string(commands.flatMap(c => [...c.encode(), ...SPACER]))
    console.log(hex, commandData);
    sendMqttData(Buffer.from([Mode.ONCE, ...hexBytes, ...commandData]));
  };

  return (
    <AppContainer>
      <Header />
      {frameStatus !== 'CONNECTED' && false
        ? <ConnectPage hasError={hasError} frameStatus={frameStatus} />
        : <ColorPickers sendCommands={sendCommands} />}
    </AppContainer>
  );
}

export default App;
