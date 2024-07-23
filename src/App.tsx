import React, { useState } from 'react';
import styled from 'styled-components';

import './App.css';
import ColorPicker from './ColorPicker';
import Header from './Header';

import { ColorOption } from './brains/colors';
import { useTayframe } from './brains/useTayframe';
import ConnectPage from './ConnectPage';
import { hexToBytes } from './brains/utils';
import { bits_to_arduino_string } from './brains/arduinoUtils';

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const [color] = useState();
  let { isConnected, isConnecting, connect, write } = useTayframe();
  // isConnected = true;

  const sendNewColor = (color: ColorOption) => {
    console.log(`Sending new color: ${color.hex}`);
    // Remove leading '#' and convert to RGB bytes
    const hexBytes = hexToBytes(color.hex.substring(1));
    const commandData = bits_to_arduino_string(color.data);
    write([...hexBytes, ...commandData]);
  };

  return (
    <AppContainer>
      <Header />
      {!isConnected
        ? <ConnectPage isConnecting={isConnecting} connect={connect} />
        : <ColorPicker selectedColor={color} selectColor={sendNewColor} />}
    </AppContainer>
  );
}

export default App;
