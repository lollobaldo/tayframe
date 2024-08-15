import React, { useMemo } from "react";
import styled from "styled-components";
import ReactSlider from "react-slider";
import { HsvaColor, hsvaToHex } from "@uiw/color-convert";

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 12px;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
`;

const StyledThumb = styled.div<{ $hex: string }>`
  background-color: ${({ $hex }) => $hex};
  outline: none;
  height: 22px;
  line-height: 22px;
  width: 22px;
  text-align: center;
  border-radius: 50%;
  cursor: grab;
  top: -5px;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);

  &:active, &:focus {
    outline: 2px solid ${({ $hex }) => $hex};
  }
`;

const StyledTrack = styled.div<any>`
  top: 0;
  bottom: 0;
  background: #ccc;
  border-radius: 999px;
`;

const Track = (props: any, state: any) => <StyledTrack {...props} index={state.index} />;

export interface SliderProps {
  color: HsvaColor;
  value: number;
  onChange: (newValue: number) => void;
}

const Slider = ({ color, value, onChange }: SliderProps) => {
  const hex = hsvaToHex(color);

  const coloredThumb = useMemo(() => ({ key, ...props }: any): JSX.Element => (
    <StyledThumb {...props} key={key} $hex={hex} />
  ), [hex]);

  return (
    <StyledSlider
      min={0}
      max={7}
      marks={true}
      value={value}
      onChange={(value) => onChange(value as number)}
      renderTrack={Track}
      renderThumb={coloredThumb}
    />
  );
};

export default Slider;
