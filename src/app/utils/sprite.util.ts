import { flattenDeep } from 'lodash';
import { AnimationImage } from '../models/hero';

export const convertImageToSpriteModel = (
  images: AnimationImage[]
): Array<number> => {
  const sprites = images.map((image) => [
    image.x,
    image.y,
    image.width,
    image.height,
  ]);
  const sprite = flattenDeep(sprites);
  return sprite;
};
