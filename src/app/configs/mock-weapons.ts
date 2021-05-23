import { Weapon } from '../models/weapon';

export const WEAPONS: Weapon[] = [
  { id: 1, name: 'Radiance sword', damage: 10 },
  { id: 2, name: 'Green Bow', damage: 8 },
  { id: 3, name: 'Mjolnir hammer', damage: 12 },
  { id: 4, name: 'Monkey King Bar', damage: 15 },
  { id: 5, name: 'Skull basher', damage: 11 },
  { id: 6, name: 'Desolator', damage: 14 },
].map((data) => new Weapon(data));
