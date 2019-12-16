function colorToHex(color) {
  const hex = color.toString(16);
  return hex.length < 2 ? `0${hex}` : hex;
}

exports.rgbToHex = (r, g, b) => `#${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`;
