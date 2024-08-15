import React from 'react';
import styled from 'styled-components';
import { Buffer } from 'buffer';

import './App.css';
import Header from './Header';

import { Mode, Color } from './brains/colors';
import { useTayframeMqtt } from './brains/useTayframeMqtt';
import ConnectPage from './ConnectPage';
import { hexToBytes } from './brains/utils';
import { bits_to_arduino_string } from './brains/arduinoUtils';
import ColorPickers from './ColorPickers';

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const { frameStatus, hasError, sendMqttData } = useTayframeMqtt();

  const sendNewColor = (color: Color, mode: Mode) => {
    console.log(`Sending new color: ${color.hex}`);
    // Remove leading '#' and convert to RGB bytes
    const hexBytes = hexToBytes(color.hex.substring(1));
    const commandData = bits_to_arduino_string([...color.data]);
    console.log(commandData, color.data);
    sendMqttData(Buffer.from([mode, ...hexBytes, ...commandData]));
  };

  return (
    <AppContainer>
      <Header />
      {frameStatus !== 'CONNECTED' && false
        ? <ConnectPage hasError={hasError} frameStatus={frameStatus} />
        : <ColorPickers onChange={sendNewColor} />}
    </AppContainer>
  );
}

export default App;
