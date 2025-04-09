export const HorizontalPosition = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;
export type HorizontalPosition =
  (typeof HorizontalPosition)[keyof typeof HorizontalPosition];

export const VerticalPosition = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom",
} as const;
export type VerticalPosition =
  (typeof VerticalPosition)[keyof typeof VerticalPosition];

export const Position = {
  TOP_LEFT: `${VerticalPosition.TOP}-${HorizontalPosition.LEFT}`,
  TOP_CENTER: `${VerticalPosition.TOP}-${HorizontalPosition.CENTER}`,
  TOP_RIGHT: `${VerticalPosition.TOP}-${HorizontalPosition.RIGHT}`,
  MIDDLE_LEFT: `${VerticalPosition.MIDDLE}-${HorizontalPosition.LEFT}`,
  MIDDLE_CENTER: `${VerticalPosition.MIDDLE}-${HorizontalPosition.CENTER}`,
  MIDDLE_RIGHT: `${VerticalPosition.MIDDLE}-${HorizontalPosition.RIGHT}`,
  BOTTOM_LEFT: `${VerticalPosition.BOTTOM}-${HorizontalPosition.LEFT}`,
  BOTTOM_CENTER: `${VerticalPosition.BOTTOM}-${HorizontalPosition.CENTER}`,
  BOTTOM_RIGHT: `${VerticalPosition.BOTTOM}-${HorizontalPosition.RIGHT}`,
} as const;
export type Position = (typeof Position)[keyof typeof Position];

export const TopRowPositions: Position[] = [
  Position.TOP_LEFT,
  Position.TOP_CENTER,
  Position.TOP_RIGHT,
];

export const MiddleRowPositions: Position[] = [
  Position.MIDDLE_LEFT,
  Position.MIDDLE_CENTER,
  Position.MIDDLE_RIGHT,
];

export const BottomRowPositions: Position[] = [
  Position.BOTTOM_LEFT,
  Position.BOTTOM_CENTER,
  Position.BOTTOM_RIGHT,
];

export function splitPosition(
  position: Position,
): [VerticalPosition, HorizontalPosition] {
  const [vertical, horizontal] = position.split("-");
  return [vertical as VerticalPosition, horizontal as HorizontalPosition];
}
