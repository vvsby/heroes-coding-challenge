import { Directive, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { ContainerConfig } from 'konva/lib/Container';
import { LayerConfig } from 'konva/lib/Layer';
import { SpriteConfig } from 'konva/lib/shapes/Sprite';
import { isNil } from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, first, switchMap, takeUntil } from 'rxjs/operators';
import { HeroImageWidth } from '../configs/mock-heroes';
import { Character } from '../models/character';
import { Hero } from '../models/hero';
import { OverTurned } from '../utils/character';

export enum CharacterAnimation {
  standing = 'standing',
  run = 'run',
  attack = 'attack',
  dead = 'dead',
}

const defaultCharacterPos = {
  x: 50,
  y: 50,
};

// calculate the hero image width to get the healthBar width and position
const healthBarWidth = HeroImageWidth * 0.4;
// distance from hero.x to healthBar.x
const healthBarOffsetHeroX = (HeroImageWidth * 0.4) / 2;

// export type HeroAnimation = 'standing' | 'attack' | 'dead';
@Directive()
export class CharacterLayer extends Konva.Group implements OnDestroy {
  private heroGroups: Konva.Group = new Konva.Group();
  public heroSprite: Konva.Sprite | undefined;
  private healthBar: Konva.Group = new Konva.Group();
  // private config: ContainerConfig | undefined;

  character: Character | undefined = undefined;

  // heroImageWidth$ = new BehaviorSubject<number>(0);

  private position$ = new BehaviorSubject<{
    x: number;
    y: number;
  }>({
    x: defaultCharacterPos.x,
    y: defaultCharacterPos.y,
  });

  private unSubscribe$ = new Subject();

  /**
   *
   * @param hero$ current hero oversable
   * @param config config the group
   * @param overturn overturn the group to handle the monster
   * @param callback callback function execute after setup
   */
  constructor(
    character$: Observable<Character>,
    config?: ContainerConfig,
    overturn?: boolean,
    callback?: () => any
  ) {
    super(config);

    this.add(this.healthBar);
    this.add(this.heroGroups);

    // check config & store the position
    // doesn't find any solution to
    const x = config && !isNil(config.x) ? config.x : defaultCharacterPos.x;
    const y = config && !isNil(config.y) ? config.y : defaultCharacterPos.y;

    // this.config = config;
    this.position$.next({
      x,
      y,
    });

    let attrs = {
      x,
      y,
      width: HeroImageWidth,
      height: 300,
    };

    if (overturn) {
      attrs = {
        ...attrs,
        ...this.overTurnConfig(),
      };
    }

    this.setAttrs(attrs);

    character$
      .pipe(
        takeUntil(this.unSubscribe$),
        filter((character) => !isNil(character))
      )
      .subscribe((character) => {
        this.character = character;

        // we don't need to redraw the hero sprite
        if (!this.heroSprite) {
          this.setupSprite(character);
        }

        this.setupHealthBar(character);
      });

    character$
      .pipe(switchMap((character) => character.currentHpPercent$))
      .subscribe((currentHpPercent) => {
        // debugger;
        const healthPercent = this.healthBar.getChildren(
          (node) => node.name() === 'healthPercent'
        )[0];
        healthPercent.setAttrs({
          width: currentHpPercent * healthBarWidth,
        });
      });

    character$
      .pipe(
        switchMap((character) => character.isAlive$),
        filter((isAlive) => !isAlive),
        first()
      )
      .subscribe(() => {
        this.updateAnimation(CharacterAnimation.dead, () => {
          // const time = this.timeToDoneASprite();
          // console.log(time);
          debugger;
          setTimeout(() => {
            this.heroSprite?.stop();
          }, 950);
        });
      });
  }

  timeToDoneASprite() {
    const ani = this.heroSprite?.getAttr('animation') as CharacterAnimation;
    const frameRate = this.heroSprite?.getAttr('frameRate') as number;
    const imageLength = this.character?.animationImages[ani].image.length;
    return (Math.floor((imageLength! / frameRate) * 100) / 100) * 1000;
  }

  /**
   * Load image from hero and create the sprite
   * @param hero current hero
   * @param config
   */
  setupSprite(character: Character) {
    const { animations } = character;
    const heroAnimation: CharacterAnimation = CharacterAnimation.standing;

    // handle image load and init sprite
    const imageObj = new Image();
    imageObj.onload = () => {
      this.heroSprite = new Konva.Sprite({
        frameRate: 7,
        frameIndex: 0,
        width: HeroImageWidth,
        image: imageObj,
        animations,
        animation: heroAnimation,
        listening: false,
        x: 0,
        y: 0,
      });

      this.heroSprite.listening(false);

      // this.add(this.heroSprite);
      this.heroGroups.removeChildren();
      this.heroGroups.add(this.heroSprite);
      this.heroSprite.start();
    };

    imageObj.src = character.getImgByAnimation(heroAnimation);
  }

  /**
   * Setup Health Bar for hero
   * HealthBar = healthBar wrapper + healthBar content (that shows remaining hp)
   * @param config
   */
  setupHealthBar(character: Character) {
    const healthBarWrapper = new Konva.Rect({
      x: healthBarOffsetHeroX,
      y: -20,
      width: healthBarWidth,
      height: 15,
      stroke: '#444',
      strokeWidth: 2,
    });
    healthBarWrapper.listening(false);

    const healthPercent = new Konva.Rect({
      name: 'healthPercent',
      x: healthBarOffsetHeroX,
      y: -20,
      width: healthBarWidth,
      height: 15,
      fill: 'green',
    });
    healthPercent.listening(false);

    this.healthBar.removeChildren();
    this.healthBar.add(healthBarWrapper);
    this.healthBar.add(healthPercent);
  }

  // getCurrentAndGoalPosX(): number[] | undefined {
  //   const stage = this.getStage();
  //   if (!stage) return;
  //   const goalX = stage.width() / 2 - (this.scaleX() === 1 ? this.width() : 0);
  //   const currentPosX = this.position$.value.x;
  //   return [currentPosX, goalX];
  // }

  updateAnimation = (ani: CharacterAnimation, callback?: () => any) => {
    if (!this.character) {
      return;
    }

    // debugger;
    const imageObj = new Image();
    imageObj.onload = () => {
      const aniImages = this.character?.animationImages[ani];
      const imageWidth = aniImages?.widthPerImage;
      const frameLength = aniImages?.image.length;
      this.setAttr('width', imageWidth);
      this.heroSprite?.setAttrs({
        animation: ani,
        image: imageObj,
        width: imageWidth,
        frameRate: frameLength,
      });

      if (callback) {
        callback();
      }
    };

    imageObj.src = this.character?.getImgByAnimation(ani);
  };

  overTurnConfig() {
    return {
      scaleX: -1,
      offsetX: HeroImageWidth,
      [OverTurned]: true,
    };
  }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}