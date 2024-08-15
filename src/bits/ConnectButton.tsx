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
  font-size: x-large;
`;

const colors = {
  blue: { bg: '#a2bfff', border: '#417cfc', text: '#ffffff' },
  green: { bg: '#bfd9be', border: '#83b67f', text: '#ffffff' },
  red: { bg: '#ff9e99', border: '#ff4137', text: '#555555' },
};

type ConnectButtonProps = {
  isConnecting: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ConnectButton = ({ isConnecting, disabled = false, onClick = () => {} }: ConnectButtonProps) => {
  const buttonType = isConnecting ? RippleButton : PingButton;
  const buttonColor = disabled ? colors.red : isConnecting ? colors.green : colors.blue;
  return (
    <StyledButton as={buttonType} colors={buttonColor}
      disabled={disabled} onClick={onClick}>
        CONNECTING
    </StyledButton>
  );
};

export default ConnectButton;
