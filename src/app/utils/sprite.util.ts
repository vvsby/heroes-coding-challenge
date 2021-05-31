import { flattenDeep } from 'lodash';
import { AnimationImage } from '../models/hero';
import { CharacterLayer } from '../shared/CharacterLayer';

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

export const sumHp = (layers: CharacterLayer[]) => {
  return layers.reduce((sum, layer) => {
    const character = layer.character;
    const currentHp = character?.currentHpPercent$.value || 0;
    sum += currentHp;
    return sum;
  }, 0);
};
