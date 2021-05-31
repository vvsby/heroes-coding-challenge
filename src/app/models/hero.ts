import { CharacterAnimation } from '../shared/CharacterLayer';
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
  weapon?: Weapon;
  armour?: Armour;

  readonly imgSrc: Record<CharacterAnimation, string>;

  constructor(params: {
    id: number;
    name: string;
    health?: number;
    minDamage: number;
    maxDamage: number;
    weapon?: Weapon;
    armour?: Armour;
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
      weapon,
      armour,
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

    this.id = id;
    this.name = name;
    this.health = health || 100;
    this.currentHealth = this.health;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.imgSrc = imgSrc;
    this.weapon = weapon;
    this.armour = armour;
  }

  get realHealth(): number {
    return this.health + (this.armour?.health || 0);
  }

  get realDamage(): number {
    // random the hero base dame between min and max damage
    const baseHeroDamage =
      this.minDamage + Math.random() * (this.maxDamage - this.minDamage);
    return baseHeroDamage + (this.weapon?.damage || 0);
  }
}
