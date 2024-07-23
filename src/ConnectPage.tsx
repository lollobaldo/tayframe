import React from 'react';
import styled from 'styled-components';

import AppStoreButton from './bits/AppStoreButton';
import ConnectButton from './bits/ConnectButton';
import { isIphone } from './brains/utils';

import './App.css';

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
`;

type ConnectPageProps = {
    isConnecting: boolean;
    connect: () => void;
};

const ConnectPage = ({ isConnecting, connect }: ConnectPageProps) => {
  const hasBluetooth = !!navigator.bluetooth;

  return (
    <StyledContainer>
      {!hasBluetooth
        ? <div>
            It looks like your device does not support bluetooth on websites...<br />
            Please try a browser like Bluefy.
            <br /><br /><br />
            {isIphone() && <AppStoreButton link="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" />}
          </div>
        : <h1>ARE YOU READY<br />FOR IT?</h1>
      }
      <ConnectButton disabled={!hasBluetooth} isConnecting={isConnecting} onClick={connect} />
    </StyledContainer>
  );
}

export default ConnectPage;
