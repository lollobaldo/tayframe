import { base_color_effects, extra, special_effects } from './raw_colors';

export enum Mode {
  ONCE,
  SOLID,
  BLINK,
  FADE,
}

export type Color = {
  hex: string;
  data: number[];
};

export type State = {
  mode: Mode;
  color: Color;
};

export type ColorOptions = {
  solid: Color[];
};

export const options: ColorOptions = {
  solid: [
    { hex: '#ff0000', data: base_color_effects.RED },
    { hex: '#ff6600', data: base_color_effects.REDORANGE },
    { hex: '#ffbb00', data: base_color_effects.ORANGE },
    { hex: '#ffff00', data: base_color_effects.YELLOW },
    { hex: '#bfff00', data: base_color_effects.YELLOWGREEN },
    { hex: '#90ee00', data: base_color_effects.LIGHT_GREEN },
    { hex: '#00ff00', data: base_color_effects.GREEN },
    { hex: '#30d5c8', data: base_color_effects.TURQUOISE },
    { hex: '#51aff7', data: base_color_effects.LIGHT_BLUE },
    { hex: '#0000ff', data: base_color_effects.BLUE },
    { hex: '#ff00ff', data: base_color_effects.MAGENTA },
    { hex: '#FF69B4', data: base_color_effects.PINK },

    { hex: '#ff0000', data: extra.LAST_SIGNAL },
    { hex: '#00ff00', data: extra.SLOW_PURPLE },
    { hex: '#0000ff', data: special_effects.WEIRD_2 },
  ]
};