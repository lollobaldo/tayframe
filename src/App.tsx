import React, { useState } from 'react';
import styled from 'styled-components';

import './App.css';
import ColorPicker from './ColorPicker';
import Header from './Header';
import ConnectButton from './ConnectButton';

// import { bits_to_arduino_string } from './brains/arduinoUtils';
import { options } from './brains/colors';
import { useTayframe } from './brains/useTayframe';

// const red = [1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1];
// const blue = [1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1];
// const yellow = [1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1];

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const [color] = useState();
  const { isConnected, isConnecting, connect } = useTayframe();

  const hasBluetooth = !!navigator.bluetooth;

  return (
    <AppContainer>
      <Header />
      {isConnected
        ? <ColorPicker colors={options['solid']} selectedColor={color} selectColor={(c) => {}} />
        : <ConnectButton hasBluetooth={hasBluetooth} isConnecting={isConnecting} onClick={connect} />}
    </AppContainer>
  );
}

export default App;
