export const color_palettes = {
  "Michael": ['#28a0f4'],
  "Pam": ['#B585BC'],
  "Stanley": ['#806100'],
  "Meredith": ['#366649'],
  "Andy": ['#cff47b'],
  "Erin": ['#CC9FAA'],
  "Roy": ['#654a2e'],
  "Dwight": ['#bf9000'],
  "Ryan": ['#4f4343ff'],
  "Phyllis": ['#6947cd'],
  "Toby": ['#bd914c'],
  "Oscar": ['#957284'],
  "Jan": ['#be4343ff'],
  "Robert": ['#5b5b5b'],
  "Jim": ['#7eb4e5'],
  "Angela": ['#e9e9e6'],
  "Kevin": ['#955d06'],
  "Kelly": ['#ffa5a5'],
  "Creed": ['#9f0b00ff'],
  "Darryl": ['#96844cff'],
}



// Helper
function hexToHsl(hex) {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}


export function stringToColors(str, count = 5, baseHue = null) {
  // If baseHue is a hex, generate a gradient from it
  if (typeof baseHue === 'string' && baseHue.startsWith('#')) {
    const [h, s, l] = hexToHsl(baseHue);
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(h + i * 12) % 360}, ${s}%, ${l}%)`);
    }
    return colors;
  }

  // Original hash-based logic
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  if (baseHue == null) {
    baseHue = Math.abs(hash) % 360;
  }

  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * 12) % 360;
    const saturation = 30 + ((hash >> (i * 2)) % 25);
    const lightness = 40 + ((hash >> (i * 3)) % 30);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

