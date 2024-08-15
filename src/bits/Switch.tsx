import React from 'react';
import './switch.css';
import { hexToHsva, HsvaColor, hsvaToHex } from '@uiw/color-convert';

export interface SwitchProps {
  state: boolean;
  onChange: (newValue: boolean) => void;
  color: HsvaColor;
  colorTwo?: HsvaColor;
  style?: React.CSSProperties;
}

const Switch = ({ state, onChange, color, colorTwo = hexToHsva('#ccc'), style }: SwitchProps) => {
  const hex1 = hsvaToHex(color);
  const hex2 = hsvaToHex(colorTwo);

  return (
    <span style={style}>
      <input
        checked={state}
        onChange={() => onChange(!state)}
        className="switch-checkbox"
        id={`switch`}
        type="checkbox"
      />
      <label
        style={{ background: state ? hex1 : hex2 }}
        className="switch-label"
        htmlFor={`switch`}>
        <span className={`switch-button`} />
      </label>
    </span>
  );
};

export default Switch;
