import { color_palettes, stringToColors } from "./colorPalettes";

export const getGradientForQuote = (quote) => {
    if(!quote) return "conic-gradient(#000, #333)";
    const baseHue = color_palettes[quote.character]?.[0];
    const colors = stringToColors(quote.character, 5, baseHue);
    return `conic-gradient(${colors.join(",")})`;
}