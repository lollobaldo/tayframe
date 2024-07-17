import React from 'react';
import styled from 'styled-components';
import { PingButton, RippleButton } from './Buttons';

type StyledButtonProps = {
  colors: { bg: string, border: string, text: string };
};

const StyledButton = styled.button<StyledButtonProps>`
  aspect-ratio: 1;
  width: 60%;
  border-radius: 100%;
  background: ${({ colors }) => colors.bg};
  color: ${({ colors }) => colors.text};
  border: 2px solid ${({ colors }) => colors.border};
  font-size: xx-large;
`;

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
`;

const colors = {
  blue: { bg: '#a2bfff', border: '#417cfc', text: '#ffffff' },
  green: { bg: '#bfd9be', border: '#83b67f', text: '#ffffff' },
  red: { bg: '#ff9e99', border: '#ff4137', text: '#555555' },
};

type ConnectButtonProps = {
  hasBluetooth: boolean;
  isConnecting: boolean;
  onClick: () => void;
};

const ConnectButton = ({ hasBluetooth, isConnecting, onClick }: ConnectButtonProps) => {
  const buttonType = isConnecting ? RippleButton : PingButton;
  const buttonColor = !hasBluetooth ? colors.red : isConnecting ? colors.green : colors.blue;
  return (
    <StyledContainer>
      <h1>ARE YOU READY<br />FOR IT?</h1>
      {!hasBluetooth && 'It looks like your device does not support bluetooth on websites...'}
      <StyledButton as={buttonType} colors={buttonColor}
        disabled={!hasBluetooth} onClick={onClick}>
          CONNECT
      </StyledButton>
    </StyledContainer>
  );
};

export default ConnectButton;
