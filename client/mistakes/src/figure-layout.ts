// Inline exam figures are sized in text lines, independently of photo resolution.
// Exceptionally tall captures contain a longer section of the source paper.
export const FIGURE_HEIGHT_SCALE = 1.15;

export function figureLineCount(width: number, height: number): 3 | 4 | 5 | null {
  const ratio = width / height;
  if (ratio < .4) return null;
  if (ratio >= 1.6) return 3;
  if (ratio >= 1) return 4;
  return 5;
}
