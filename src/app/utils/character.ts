import { Container } from 'konva/lib/Container';
import { Group } from 'konva/lib/Group';
import { Shape } from 'konva/lib/Shape';

export const OverTurned = 'overTurned';

export const isOverTurned = (group: Group | Shape): boolean => {
  return group.getAttr(OverTurned);
};
