import { CharacterAnimation } from '../shared/CharacterLayer';
import { Character } from './character';
import { AnimationImage, Hero } from './hero';

export class Monster extends Character {
  constructor(params: {
    id: number;
    name: string;
    health?: number;
    minDamage: number;
    maxDamage: number;
    imgSrc: Record<CharacterAnimation, string>;
    animationImages: Record<
      CharacterAnimation,
      { widthPerImage: number; image: AnimationImage[] }
    >;
  }) {
    const { id, name, health, minDamage, maxDamage, imgSrc, animationImages } =
      params;
    super({
      id,
      name,
      health,
      minDamage,
      maxDamage,
      imgSrc,
      animationImages,
    });

    debugger;
    console.log(this.health);
  }

  get realDamage(): number {
    // random dame between min and max damage
    return this.minDamage + Math.random() * (this.maxDamage - this.minDamage);
  }
}
