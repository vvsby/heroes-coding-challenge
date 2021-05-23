export class Weapon {
  id: number;
  name: string;
  damage: number;

  // So great if we have the time for weapon
  imgSrc?: string;

  // may be we can add the effect if we have time

  constructor(params: {
    id: number;
    name: string;
    damage: number;
    imgSrc?: string;
  }) {
    const { id, name, damage, imgSrc } = params;
    this.id = id;
    this.name = name;
    this.damage = damage;
    this.imgSrc = imgSrc;
  }
}
