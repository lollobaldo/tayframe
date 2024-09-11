import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { Buffer } from 'buffer';
import { HexColor } from '@uiw/color-convert';

import './App.css';
import ColorPickers from './ColorPickers';
import ConnectPage from './ConnectPage';
import Header from './Header';
import Instructions from './Instructions';

import { Mode } from './brains/colors';
import { useTayframeMqtt } from './brains/useTayframeMqtt';
import { hexToBytes } from './brains/utils';
import { bits_to_arduino_string } from './brains/arduinoUtils';
import { Command, SPACER } from './brains/pixmob';

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
    console.log(hex, commandData, commands);
    sendMqttData(Buffer.from([Mode.ONCE, ...hexBytes, ...commandData]));
  };

  return (
    <AppContainer>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/mqtt-error" element={<ConnectPage hasError={hasError} frameStatus={frameStatus} />} />
          <Route path="/instructions/:stage?" element={<Instructions frameStatus={frameStatus} />} />
          <Route path="/app" element={<ColorPickers sendCommands={sendCommands} />} />
          <Route path="*"
            element={hasError || frameStatus !== 'CONNECTED'
              ? <Navigate to='/mqtt-error' />
              : <Navigate to='/app' />}
          />
        </Routes>
      </BrowserRouter>
    </AppContainer>
  );
}

export default App;
