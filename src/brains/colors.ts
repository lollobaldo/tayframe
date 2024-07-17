export type ColorOption = {
    hex: string;
    data?: string[];
};

export type ColorOptions = {
    solid: ColorOption[];
};

export const options: ColorOptions = {
    solid: [
        { hex: '#FF69B4' },
        { hex: '#ff0000' },
        { hex: '#ff6600' },
        { hex: '#ffbb00' },
        { hex: '#ffff00' },
        { hex: '#bfff00' },
        { hex: '#90ee00' },
        { hex: '#00ff00' },
        { hex: '#30d5c8' },
        { hex: '#0000ff' },
        { hex: '#6600ff' },
        { hex: '#ff00ff' },
        // { hex: '#51aff7' },
    ]
};