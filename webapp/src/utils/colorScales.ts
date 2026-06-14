// Color scale utilities for H3 choropleth

/**
 * Generate a color for a given normalized value (0-1) using a sequential color ramp.
 * Uses a custom blue-green-yellow-red scheme optimized for accessibility.
 */
export function getScoreColor(value: number): [number, number, number] {
  // Clamp to [0, 1]
  const t = Math.max(0, Math.min(1, value));

  // Multi-stop color ramp: dark blue → teal → green → yellow → orange → red
  if (t < 0.2) {
    const s = t / 0.2;
    return lerpColor([34, 94, 168], [43, 140, 190], s);   // blue → teal
  } else if (t < 0.4) {
    const s = (t - 0.2) / 0.2;
    return lerpColor([43, 140, 190], [116, 196, 118], s);  // teal → green
  } else if (t < 0.6) {
    const s = (t - 0.4) / 0.2;
    return lerpColor([116, 196, 118], [254, 217, 118], s); // green → yellow
  } else if (t < 0.8) {
    const s = (t - 0.6) / 0.2;
    return lerpColor([254, 217, 118], [253, 141, 60], s);  // yellow → orange
  } else {
    const s = (t - 0.8) / 0.2;
    return lerpColor([253, 141, 60], [215, 48, 39], s);    // orange → red
  }
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/**
 * Convert RGB array to CSS hex string.
 */
export function rgbToHex(rgb: [number, number, number]): string {
  return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
}

/**
 * Generate legend entries: evenly spaced value-color pairs.
 */
export function generateLegendEntries(
  min: number,
  max: number,
  steps: number = 10
): { label: string; color: string }[] {
  const entries: { label: string; color: string }[] = [];
  for (let i = 0; i <= steps; i++) {
    const value = min + (max - min) * (i / steps);
    const normalized = i / steps;
    entries.push({
      label: value.toFixed(3),
      color: rgbToHex(getScoreColor(normalized)),
    });
  }
  return entries;
}
