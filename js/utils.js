// Utility functions reused across modules

// Safely escape HTML special characters in a string
export function escapeHTML(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Compute the angular separation between two celestial coordinates
export function angularSep(ra1, dec1, ra2, dec2) {
  const d2r = Math.PI / 180;
  ra1 *= d2r; dec1 *= d2r; ra2 *= d2r; dec2 *= d2r;
  const s = Math.acos(Math.sin(dec1) * Math.sin(dec2) +
                      Math.cos(dec1) * Math.cos(dec2) * Math.cos(ra1 - ra2));
  return s / d2r;
}

