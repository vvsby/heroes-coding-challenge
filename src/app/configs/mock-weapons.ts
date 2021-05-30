import { Weapon } from '../models/weapon';

export const WEAPONS: Weapon[] = [
  { id: 1, name: 'Radiance sword', damage: 4 },
  { id: 2, name: 'Green Bow', damage: 2 },
  { id: 3, name: 'Mjolnir hammer', damage: 6 },
  { id: 4, name: 'Monkey King Bar', damage: 9 },
  { id: 5, name: 'Skull basher', damage: 5 },
  { id: 6, name: 'Desolator', damage: 3 },
].map((data) => new Weapon(data));
