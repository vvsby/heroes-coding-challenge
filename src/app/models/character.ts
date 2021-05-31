import { transform } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { CharacterAnimation } from '../shared/CharacterLayer';
import { convertImageToSpriteModel } from '../utils/common.util';
import { AnimationImage } from './hero';

export abstract class Character {
  readonly id: number;
  name: string;

  health: number;

  avatar: string = '';
  currentHpPercent$: BehaviorSubject<number>;

  isAlive$ = new BehaviorSubject<boolean>(true);

  private _target?: Character | undefined;
  //   private _targetId?: number | undefined;

  // we have the range damage
  readonly minDamage: number;
  readonly maxDamage: number;

  readonly imgSrc: Record<CharacterAnimation, string>;
  readonly animationImages: Record<
    CharacterAnimation,
    {
      heightPerImage: number;
      widthPerImage: number;
      image: AnimationImage[];
    }
  >;

  constructor(params: {
    id: number;
    name: string;
    health?: number;
    minDamage: number;
    maxDamage: number;
    avatar: string;
    imgSrc: Record<CharacterAnimation, string>;
    animationImages: Record<
      CharacterAnimation,
      { widthPerImage: number; heightPerImage: number; image: AnimationImage[] }
    >;
  }) {
    const {
      id,
      name,
      health,
      minDamage,
      maxDamage,
      avatar,
      imgSrc,
      animationImages,
    } = params;

    this.id = id;
    this.name = name;
    this.health = health || 100;
    this.currentHpPercent$ = new BehaviorSubject<number>(1);
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.imgSrc = imgSrc;
    this.avatar = avatar;
    this.animationImages = animationImages;
  }

  // get the damage of character
  abstract realDamage: number;
  abstract realHealth: number;

  getDamage(damage: number) {
    const hp =
      Math.max(this.currentHpPercent$.value * this.realHealth - damage, 0) /
      this.health;
    this.currentHpPercent$.next(hp);

    if (!hp && this.isAlive) {
      this.isAlive$.next(false);
      this.isAlive$.complete();
    }
  }

  getImgByAnimation(animation: CharacterAnimation): string {
    return this.imgSrc[animation];
  }

  get animations(): Record<CharacterAnimation, Array<number>> {
    const _animations: Record<CharacterAnimation | string, Array<number>> = {};

    Object.keys(this.animationImages).forEach((animationName) => {
      const sprite = convertImageToSpriteModel(
        this.animationImages[animationName as CharacterAnimation].image
      );
      _animations[animationName] = sprite;
    });

    return _animations;
  }

  //   get currentHP() {
  //     return this.currentHp$.value;
  //   }

  //   getCurrentHpPercent(): number {
  //     return this.currentHP / this.health;
  //   }

  set target(character: Character | undefined) {
    this._target = character;
  }

  get target(): Character | undefined {
    return this._target;
  }

  get isAlive() {
    return this.isAlive$.value;
  }

  get currentHpPercent() {
    return this.currentHpPercent$.value;
  }

  //   set target(id: number | undefined) {
  //     this._targetId = id;
  //   }

  //   get target(): number | undefined {
  //     return this._targetId;
  //   }
}
