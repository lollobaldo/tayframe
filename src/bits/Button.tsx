import styled from "styled-components";

const colors = {
  blue: { bg: '#cadafe', border: '#6998fd', text: '#ffffff' },
  green: { bg: '#deebdd', border: '#a1c89e', text: '#ffffff' },
  red: { bg: '#feccc9', border: '#ff6f68', text: '#555555' },};

const Button = styled.button<{ $color: keyof typeof colors }>`
  width: 100%;
  padding: 10px;
  height: fit-content;
  border-radius: 100px;
  background: ${props => colors[props.$color].bg};
  border: 1px solid ${props => colors[props.$color].border};
  font-size: larger;
`;

export default Button;
