import { Armour } from '../models/armour';

export const ARMOURS: Armour[] = [
  { id: 1, name: 'Blade Mail', health: 4 },
  { id: 2, name: 'Shiva Guard', health: 5 },
  { id: 3, name: 'Assault Cuirass', health: 5 },
  { id: 3, name: 'Normal Guard', health: 2 },
].map((data) => new Armour(data));
