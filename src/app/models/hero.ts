import { Armour } from './armour';
import { Weapon } from './weapon';

export class Hero {
  id: number;
  name: string;

  health: number;

  // we have the range damage
  minDamage: number;
  maxDamage: number;

  // may be the hero doesn't have weapon and armour
  weapons?: Weapon;
  armour?: Armour;

  constructor(params: {
    id: number;
    name: string;
    health?: number;
    minDamage: number;
    maxDamage: number;
  }) {
    const { id, name, health, minDamage, maxDamage } = params;

    this.id = id;
    this.name = name;
    this.health = health || 100;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
  }

  get heroHealth(): number {
    return this.health + (this.armour?.health || 0);
  }

  get heroDamage(): number {
    // random the hero base dame between min and max damage
    const baseHeroDamage = Math.random() * (this.maxDamage - this.minDamage);
    return baseHeroDamage + (this.weapons?.damage || 0);
  }
}
