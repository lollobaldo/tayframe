import React from 'react';
import styled from 'styled-components';

import ConnectButton from './bits/ConnectButton';

import './App.css';
import { FrameStatus } from './brains/useTayframeMqtt';

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
`;

type ConnectPageProps = {
  hasError: boolean;
  frameStatus: FrameStatus;
};

const ConnectPage = ({ hasError, frameStatus }: ConnectPageProps) => (
  <StyledContainer>
    {hasError
      ? <div>
          Something went wrong! Please scan the QR code on the back to try again!<br />
        </div>
      : frameStatus === 'DISCONNECTED'
      ? <div>
          It looks like your TayFrame is not connected to the internet! Do check it's plugged in correctly!<br />
        </div>
      : <h1>ARE YOU READY<br />FOR IT?</h1>
    }
    <ConnectButton disabled={hasError || frameStatus === 'DISCONNECTED'} isConnecting={true} />
  </StyledContainer>
);

export default ConnectPage;
