export const CardFeaturePosition = {
  BOTTOM: "bottom",
  INLINE: "inline",
} as const;
export type CardFeaturePosition =
  (typeof CardFeaturePosition)[keyof typeof CardFeaturePosition];
