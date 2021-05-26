import { HeroInterface } from './interfaces/hero.interface';
import { WeaponInterface } from './interfaces/weapon.interface';

export const HEROES: HeroInterface[] = [
  { id: 11, name: 'Dr Nice', health: 100 },
  { id: 12, name: 'Narco', health: 100 },
  { id: 13, name: 'Bombasto', health: 100 },
  { id: 14, name: 'Celeritas', health: 100 },
  { id: 15, name: 'Magneta', health: 100 },
  { id: 16, name: 'RubberMan', health: 100 },
  { id: 17, name: 'Dynama', health: 100 },
  { id: 18, name: 'Dr IQ', health: 100 },
  { id: 19, name: 'Magma', health: 100 },
  { id: 20, name: 'Tornado', health: 100 },
];

export const WEAPONS: WeaponInterface[] = [
  { id: 21, name: 'M16', damage: 20 },
  { id: 22, name: 'AK-47', damage: 25 },
  { id: 23, name: 'Sigma', damage: 10 },
  { id: 24, name: 'F1', damage: 80 },
  { id: 25, name: 'Bazooka', damage: 75 },
  { id: 26, name: 'Uzi', damage: 10 },
];
