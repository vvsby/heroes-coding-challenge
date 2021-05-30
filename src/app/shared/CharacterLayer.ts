import { Directive, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { ContainerConfig } from 'konva/lib/Container';
import { LayerConfig } from 'konva/lib/Layer';
import { SpriteConfig } from 'konva/lib/shapes/Sprite';
import { isNil } from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HeroImageWidth } from '../configs/mock-heroes';
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

  private hero: Hero | undefined = undefined;

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
    hero$: Observable<Hero>,
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

    hero$
      .pipe(
        takeUntil(this.unSubscribe$),
        filter((hero) => !isNil(hero))
      )
      .subscribe((hero) => {
        this.hero = hero;

        // we don't need to redraw the hero sprite
        if (!this.heroSprite) {
          this.setupSprite(hero);
        }

        this.setupHealthBar(hero);
      });
  }

  /**
   * Load image from hero and create the sprite
   * @param hero current hero
   * @param config
   */
  setupSprite(hero: Hero) {
    const { animations } = hero;
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

      // this.add(this.heroSprite);
      this.heroGroups.removeChildren();
      this.heroGroups.add(this.heroSprite);
      this.heroSprite.start();
    };

    imageObj.src = hero.getImgByAnimation(heroAnimation);
  }

  /**
   * Setup Health Bar for hero
   * HealthBar = healthBar wrapper + healthBar content (that shows remaining hp)
   * @param config
   */
  setupHealthBar(hero: Hero) {
    const healthBarWrapper = new Konva.Rect({
      x: healthBarOffsetHeroX,
      y: -20,
      width: healthBarWidth,
      height: 15,
      stroke: '#444',
      strokeWidth: 2,
    });

    const healthPercent = new Konva.Rect({
      x: healthBarOffsetHeroX,
      y: -20,
      width: hero.currentHealthPercent * healthBarWidth,
      height: 15,
      fill: 'green',
    });

    this.healthBar.removeChildren();
    this.healthBar.add(healthBarWrapper);
    this.healthBar.add(healthPercent);
  }

  getCurrentAndGoalPosX(): number[] | undefined {
    const stage = this.getStage();
    if (!stage) return;
    const goalX = stage.width() / 2 - (this.scaleX() === 1 ? this.width() : 0);
    const currentPosX = this.position$.value.x;
    return [currentPosX, goalX];
  }

  updateAnimation = (ani: CharacterAnimation) => {
    if (!this.hero) {
      return;
    }

    const imageObj = new Image();
    imageObj.onload = () => {
      this.heroSprite?.setAttrs({
        animation: ani,
        image: imageObj,
      });
    };

    imageObj.src = this.hero?.getImgByAnimation(ani);
  };

  overTurnConfig() {
    return {
      scaleX: -1,
      offsetX: HeroImageWidth,
      [OverTurned]: true,
    };
  }

  // goTo({ x, y }: { x: number; y: number }, callback?: () => any): void {
  //   // const current
  //   const stage = this.getStage();
  //   if (!stage) return;

  //   const goalX = stage.width() / 2 - this.width();

  //   const self = this;
  //   const stageWidth = stage.width();

  //   // s = v * t
  //   // x2 - x = v * deltaT
  //   // x2 = x + v * deltaT
  //   // => we just have to setup the v belong to the stage
  //   debugger;
  //   const deltaT = 2000;
  //   const currentPosX = this.position$.value.x;
  //   const v = (goalX - currentPosX) / deltaT;

  // const moveAni = new Konva.Animation(function (frame) {
  //   if (!frame) return;

  //   const newPosX = Math.min(currentPosX + frame?.time * v, goalX);
  //   self?.x(newPosX);

  //   // check to stop animation
  //   if (newPosX === goalX) {
  //     debugger;
  //     moveAni.stop();
  //     callback && callback();
  //   }
  // }, this);

  // moveAni.start();
  // }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
