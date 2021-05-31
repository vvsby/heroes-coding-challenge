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
    avatar: string;
    imgSrc: Record<CharacterAnimation, string>;
    animationImages: Record<
      CharacterAnimation,
      { widthPerImage: number; heightPerImage: number; image: AnimationImage[] }
    >;
  }) {
    const {
      id,
      name,
      health,
      minDamage,
      maxDamage,
      avatar,
      imgSrc,
      animationImages,
    } = params;
    super({
      id,
      name,
      health,
      minDamage,
      maxDamage,
      avatar,
      imgSrc,
      animationImages,
    });
  }

  get realDamage(): number {
    // random dame between min and max damage
    return this.minDamage + Math.random() * (this.maxDamage - this.minDamage);
  }

  get realHealth(): number {
    return this.health;
  }
}
