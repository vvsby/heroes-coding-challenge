import { Hero } from '../models/hero';
import { Monster } from '../models/monster';

export const HeroImageWidth = 249.1;

const walkPosition = [
  {
    x: 0,
    y: 0,
    width: 248.6,
    height: 300,
  },
  {
    x: 248.6,
    y: 0,
    width: 248.6,
    height: 300,
  },
  {
    x: 497.2,
    y: 0,
    width: 248.6,
    height: 300,
  },
  {
    x: 745.8,
    y: 0,
    width: 248.6,
    height: 300,
  },
  {
    x: 994.4,
    y: 0,
    width: 248.6,
    height: 300,
  },
  {
    x: 1243,
    y: 0,
    width: 248.6,
    height: 300,
  },
  {
    x: 1491.6,
    y: 0,
    width: 248.6,
    height: 300,
  },
  {
    x: 1740.2,
    y: 0,
    width: 248.6,
    height: 300,
  },
  {
    x: 1988.8,
    y: 0,
    width: 248.6,
    height: 300,
  },
];

const deadPosition = [
  {
    x: 0,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 358.75,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 717.5,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 1076.25,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 1435,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 1793.75,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 2152.5,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 2511.25,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 2870,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 3228.75,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 3587.5,
    y: 0,
    width: 358.75,
    height: 300,
  },
  {
    x: 3946.25,
    y: 0,
    width: 358.75,
    height: 300,
  },
];

const attackPosition = [
  {
    x: 0,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 248.53,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 497.06,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 745.59,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 994.12,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 1242.65,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 1491.18,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 1739.71,
    y: 0,
    width: 248.53,
    height: 300,
  },
];

const standingPositon = [
  {
    x: 0,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 248.53,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 497.06,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 745.59,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 994.12,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 1242.65,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 1491.18,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 1739.71,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 1988.24,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 2236.77,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 2485.3,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 2733.83,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 2982.36,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 3230.89,
    y: 0,
    width: 248.53,
    height: 300,
  },
  {
    x: 3479.42,
    y: 0,
    width: 248.53,
    height: 300,
  },
];

export const MONSTERS: Monster[] = [
  {
    id: 20,
    name: 'Zombie',
    minDamage: 30,
    maxDamage: 35,
    avatar: '/assets/images/zombie/avatar.png',
    imgSrc: {
      standing: '/assets/images/zombie/standing.png',
      run: '/assets/images/zombie/run.png',
      attack: '/assets/images/zombie/attack.png',
      dead: '/assets/images/zombie/dead.png',
    },
    animationImages: {
      standing: {
        widthPerImage: 248.53,
        heightPerImage: 300,
        image: standingPositon,
      },

      run: {
        widthPerImage: 248.6,
        heightPerImage: 300,
        image: walkPosition,
      },

      attack: {
        widthPerImage: 248.5,
        heightPerImage: 300,
        image: attackPosition,
      },

      dead: {
        widthPerImage: 358.75,
        heightPerImage: 300,
        image: deadPosition,
      },
    },
  },
  // { id: 2, name: 'Narco', minDamage: 30, maxDamage: 35 },
  // { id: 3, name: 'Bombasto', minDamage: 30, maxDamage: 35 },
  // { id: 4, name: 'Celeritas', minDamage: 30, maxDamage: 35 },
  // { id: 5, name: 'Magneta', minDamage: 30, maxDamage: 35 },
  // { id: 6, name: 'RubberMan', minDamage: 30, maxDamage: 35 },
  // { id: 7, name: 'Dynama', minDamage: 30, maxDamage: 35 },
].map((data) => new Monster(data));
