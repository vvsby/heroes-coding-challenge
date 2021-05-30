import { CharacterAnimation } from '../shared/CharacterLayer';
import { convertImageToSpriteModel } from '../utils/sprite.util';
import { Armour } from './armour';
import { Character } from './character';
import { Weapon } from './weapon';

export interface AnimationImage {
  x: number;
  y: number;
  width: number;
  height: number;
}
export class Hero extends Character {
  readonly id: number;
  name: string;

  health: number;

  currentHealth: number;

  // we have the range damage
  readonly minDamage: number;
  readonly maxDamage: number;

  // may be the hero doesn't have weapon and armour
  private weapons?: Weapon;
  private armour?: Armour;

  readonly imgSrc: Record<CharacterAnimation, string>;

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

    this.id = id;
    this.name = name;
    this.health = health || 100;
    this.currentHealth = this.health;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.imgSrc = imgSrc;
  }

  get heroHealth(): number {
    return this.health + (this.armour?.health || 0);
  }

  get realDamage(): number {
    // random the hero base dame between min and max damage
    const baseHeroDamage =
      this.minDamage + Math.random() * (this.maxDamage - this.minDamage);
    console.log(baseHeroDamage + (this.weapons?.damage || 0));
    return baseHeroDamage + (this.weapons?.damage || 0);
  }
}
