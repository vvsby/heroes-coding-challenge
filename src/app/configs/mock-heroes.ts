import { Hero } from '../models/hero';

export const HEROES: Hero[] = [
  { id: 1, name: 'Dr Nice', minDamage: 30, maxDamage: 35 },
  { id: 2, name: 'Narco', minDamage: 30, maxDamage: 35 },
  { id: 3, name: 'Bombasto', minDamage: 30, maxDamage: 35 },
  { id: 4, name: 'Celeritas', minDamage: 30, maxDamage: 35 },
  { id: 5, name: 'Magneta', minDamage: 30, maxDamage: 35 },
  { id: 6, name: 'RubberMan', minDamage: 30, maxDamage: 35 },
  { id: 7, name: 'Dynama', minDamage: 30, maxDamage: 35 },
].map((data) => new Hero(data));
