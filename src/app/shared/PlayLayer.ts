import { Directive, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { ContainerConfig } from 'konva/lib/Container';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { HEROES, HeroImageWidth } from '../configs/mock-heroes';
import { MessageService } from '../message.service';
import { Hero } from '../models/hero';
import { isOverTurned } from '../utils/character';
import { CharacterLayer, CharacterAnimation } from './CharacterLayer';

const gapCharacterCenter = 70;
@Directive()
export class PlayLayer extends Konva.Layer implements OnDestroy {
  private unSubscribe$ = new Subject();

  //   private heroSubject$ = new BehaviorSubject<Hero[]>({});

  constructor() {
    super();

    this.initPlayer();

    this.startGame();
  }

  initPlayer() {
    // const knight$ = new BehaviorSubject<Hero>(HEROES[0]);
    // const knight$ = new CharacterLayer(of(HEROES[0]));
    const knight$ = this.layerProvide('hero');
    const knight2$ = this.layerProvide('monster', {
      x: 700,
    });
    knight$.addName('test');

    // knight2$.setupConfrontation();
    this.add(knight$);
    this.add(knight2$);
  }

  layerProvide(
    type: 'hero' | 'monster',
    config?: ContainerConfig
  ): CharacterLayer {
    switch (type) {
      case 'hero':
        return new CharacterLayer(of(HEROES[0]));
      case 'monster':
        return new CharacterLayer(of(HEROES[0]), config, true);
    }
  }

  startGame() {
    setTimeout(() => {
      this.goToFightArea();
    }, 2000);
  }

  goToFightArea() {
    const deltaT = 2000;

    this.children?.forEach((group) => {
      let [currentPosX, goalX] =
        (group as CharacterLayer).getCurrentAndGoalPosX() || [];

      // note: dont forget multiply with scaleX() to get the right value
      goalX = goalX + gapCharacterCenter * group.scaleX();

      debugger;
      if (!currentPosX || !goalX) {
        console.error('currentPosX or goalX get invalid value');
        return;
      }

      const v = (goalX - currentPosX) / deltaT;

      (group as CharacterLayer).updateAnimation(CharacterAnimation.run);

      const moveAni = new Konva.Animation(function (frame) {
        if (!frame) return;

        let newPosX = currentPosX + frame?.time * v;

        // get the posX
        if (isOverTurned(group)) {
          newPosX = Math.max(newPosX, goalX);
        } else {
          newPosX = Math.min(newPosX, goalX);
        }

        // const newPosX = Math.min(currentPosX + frame?.time * v, goalX);
        group.x(newPosX);

        // check to stop animation
        if (
          (isOverTurned(group) && newPosX <= goalX) ||
          (!isOverTurned(group) && newPosX >= goalX)
        ) {
          moveAni.stop();
          // start attack on fight area
          (group as CharacterLayer).updateAnimation(CharacterAnimation.attack);
        }
      }, this);

      moveAni.start();
    });
  }

  //   addHero(hero: Hero) {
  //     const isExistHero = Object.keys(this.heroSubject$.value).includes(hero.id.toString());

  //     if (isExistHero) {
  //         const newHeroSubject$ = Object.(this.heroSubject$.value)
  //     }
  //   }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
