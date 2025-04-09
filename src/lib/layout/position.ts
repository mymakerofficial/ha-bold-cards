export const HorizontalPosition = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;
export type HorizontalPosition =
  (typeof HorizontalPosition)[keyof typeof HorizontalPosition];

export const InlinePosition = {
  INLINE_LEFT: "inline-left",
  INLINE_RIGHT: "inline-right",
} as const;
export type InlinePosition =
  (typeof InlinePosition)[keyof typeof InlinePosition];

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

export const ExtendedPosition = {
  ...Position,
  ...HorizontalPosition,
  ...VerticalPosition,
  ...InlinePosition,
} as const;
export type ExtendedPosition =
  (typeof ExtendedPosition)[keyof typeof ExtendedPosition];

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

export const TopAndBottomPositions: VerticalPosition[] = [
  VerticalPosition.TOP,
  VerticalPosition.BOTTOM,
];

export const LeftAndRightPositions: HorizontalPosition[] = [
  HorizontalPosition.LEFT,
  HorizontalPosition.RIGHT,
];

export const HorizontalPositions: HorizontalPosition[] = [
  HorizontalPosition.LEFT,
  HorizontalPosition.CENTER,
  HorizontalPosition.RIGHT,
];

export const InlinePositions: InlinePosition[] = [
  InlinePosition.INLINE_LEFT,
  InlinePosition.INLINE_RIGHT,
];

export function isPosition(position: string): position is Position {
  return Object.values(Position).includes(position as Position);
}

export function splitPosition(
  position: ExtendedPosition,
): [VerticalPosition, HorizontalPosition] {
  return [
    getVerticalPosition(position) ?? VerticalPosition.MIDDLE,
    getHorizontalPosition(position) ?? HorizontalPosition.CENTER,
  ];
}

export function isTopRowPosition(position?: ExtendedPosition): boolean {
  return position?.startsWith(VerticalPosition.TOP) ?? false;
}

export function isMiddleRowPosition(position?: ExtendedPosition): boolean {
  return position?.startsWith(VerticalPosition.MIDDLE) ?? false;
}

export function isBottomRowPosition(position?: ExtendedPosition): boolean {
  return position?.startsWith(VerticalPosition.BOTTOM) ?? false;
}

export function isLeftPosition(position?: ExtendedPosition): boolean {
  return position?.endsWith(HorizontalPosition.LEFT) ?? false;
}

export function isCenterPosition(position?: ExtendedPosition): boolean {
  return position?.endsWith(HorizontalPosition.CENTER) ?? false;
}

export function isRightPosition(position?: ExtendedPosition): boolean {
  return position?.endsWith(HorizontalPosition.RIGHT) ?? false;
}

export function isInlinePosition(position?: ExtendedPosition): boolean {
  return position?.startsWith("inline") ?? false;
}

export function getVerticalPosition(
  position: ExtendedPosition,
): VerticalPosition | undefined {
  if (isTopRowPosition(position)) {
    return VerticalPosition.TOP;
  }
  if (isMiddleRowPosition(position)) {
    return VerticalPosition.MIDDLE;
  }
  if (isBottomRowPosition(position)) {
    return VerticalPosition.BOTTOM;
  }
  return undefined;
}

export function getHorizontalPosition(
  position: ExtendedPosition,
): HorizontalPosition | undefined {
  if (isLeftPosition(position)) {
    return HorizontalPosition.LEFT;
  }
  if (isCenterPosition(position)) {
    return HorizontalPosition.CENTER;
  }
  if (isRightPosition(position)) {
    return HorizontalPosition.RIGHT;
  }
  return undefined;
}
