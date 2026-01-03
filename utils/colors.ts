import { CATEGORY_COLORS } from './constants';

export function getRandomColor(excluded: string[] = []) {
  const available = CATEGORY_COLORS.filter(
    (color) => !excluded.includes(color)
  );

  if (available.length === 0) {
    return CATEGORY_COLORS[
      Math.floor(Math.random() * CATEGORY_COLORS.length)
    ];
  }

  return available[Math.floor(Math.random() * available.length)];
}
