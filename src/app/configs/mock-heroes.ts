import { Hero } from '../models/hero';

export const HeroImageWidth = 250;

const imagesPosition = [
  {
    x: 0,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 249.1,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 498.2,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 747.3,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 996.4,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 1245.5,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 1494.6,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 1743.7,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 1992.8,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
  {
    x: 2241.9,
    y: 0,
    width: HeroImageWidth,
    height: 300,
  },
];

const imagesPositionDead = [
  {
    x: 0,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 754,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 1131,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 1508,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 1885,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 2262,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 2639,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 3016,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 3393,
    y: 0,
    width: 377,
    height: 300,
  },
  {
    x: 3770,
    y: 0,
    width: 377,
    height: 300,
  },
];

export const HEROES: Hero[] = [
  {
    id: 1,
    name: 'Dr Nice',
    health: 150,
    minDamage: 40,
    maxDamage: 50,
    imgSrc: {
      standing: '/assets/images/knight/standing.png',
      run: '/assets/images/knight/run.png',
      attack: '/assets/images/knight/attack.png',
      dead: '/assets/images/knight/dead.png',
    },
    animationImages: {
      standing: {
        widthPerImage: 249.1,
        image: imagesPosition,
      },

      run: {
        widthPerImage: 249.1,
        image: imagesPosition,
      },

      attack: {
        widthPerImage: 249.1,
        image: imagesPosition,
      },

      dead: {
        widthPerImage: 377,
        image: imagesPositionDead,
      },
    },
  },
  // { id: 2, name: 'Narco', minDamage: 30, maxDamage: 35 },
  // { id: 3, name: 'Bombasto', minDamage: 30, maxDamage: 35 },
  // { id: 4, name: 'Celeritas', minDamage: 30, maxDamage: 35 },
  // { id: 5, name: 'Magneta', minDamage: 30, maxDamage: 35 },
  // { id: 6, name: 'RubberMan', minDamage: 30, maxDamage: 35 },
  // { id: 7, name: 'Dynama', minDamage: 30, maxDamage: 35 },
].map((data) => new Hero(data));
