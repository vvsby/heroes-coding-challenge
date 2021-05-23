export class Armour {
  id: number;
  name: string;
  health: number;

  imgSrc?: string;

  // may be we can add the effect if we have time

  constructor(params: {
    id: number;
    name: string;
    health: number;
    imgSrc?: string;
  }) {
    const { id, name, health, imgSrc } = params;
    this.id = id;
    this.name = name;
    this.health = health;
    this.imgSrc = imgSrc;
  }
}
