import { Container } from 'konva/lib/Container';
import { Group } from 'konva/lib/Group';
import { Shape } from 'konva/lib/Shape';

export const OverTurned = 'overTurned';

export const isOverTurned = (group: Group | Shape): boolean => {
  return group.getAttr(OverTurned);
};

export const getDistanceBetween2Point = (
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number
): number => {
  // pitago :D
  return Math.sqrt(
    Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
  );
};
