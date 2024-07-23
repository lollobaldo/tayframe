import styled, { keyframes } from 'styled-components';

type StyledEffectProps = {
  colors: { bg: string, border: string, text: string };
};

const AnimationKeyframe = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const StyledRippleButton = styled.button<StyledEffectProps>`
  --uib-color: ${({ colors }) => colors.bg};
  --uib-speed: 2s;
  position: relative;

  &::before,
  &::after,
  .dot::before,
  .dot::after {
    ${({ disabled }) => disabled ? 'display: none' : ''};
    content: '';
    position: absolute;
    z-index: -1;
    top: -50%;
    left: -50%;
    height: 200%;
    width: 200%;
    border-radius: 50%;
    background-color: var(--uib-color);
    animation: ${AnimationKeyframe} var(--uib-speed) linear infinite;
    transform: scale(0);
    opacity: 0;
    transition: background-color 0.3s ease;
  }

  &::after { animation-delay: calc(var(--uib-speed) / -4) }
  .dot::before { animation-delay: calc(var(--uib-speed) * -0.5) }
  .dot::after { animation-delay: calc(var(--uib-speed) * -0.75) }
`;

export const StyledPingButton = styled(StyledRippleButton)`
  &::before,
  &::after {
    animation: ${AnimationKeyframe} var(--uib-speed) ease infinite;
  }
`;

export const PingButton = ({ children, ...props }: any) => (
  <StyledPingButton {...props}>
    {children}
  </StyledPingButton>
);

export const RippleButton = ({ children, ...props }: any) => (
  <StyledRippleButton {...props}>
    <div className="dot">
      {children}
    </div>
  </StyledRippleButton>
);
