import { Directive, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { HEROES } from '../configs/mock-heroes';
import { MessageService } from '../message.service';
import { Hero } from '../models/hero';
import { CharacterLayer, CharacterAnimation } from './CharacterLayer';

// export type HeroAnimation = 'standing' | 'attack' | 'dead';
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
    const knight$ = new CharacterLayer(of(HEROES[0]));
    const knight2$ = new CharacterLayer(of(HEROES[0]), {
      y: 100,
    } as any);
    knight$.addName('test');
    this.add(knight$);
    this.add(knight2$);
  }

  startGame() {
    setTimeout(() => {
      this.goToFightArea();
    }, 2000);
  }

  goToFightArea() {
    const deltaT = 2000;

    this.children?.forEach((group) => {
      const [currentPosX, goalX] =
        (group as CharacterLayer).getCurrentAndGoalPosX() || [];

      if (!currentPosX || !goalX) {
        console.error('currentPosX or goalX get invalid value');
        return;
      }

      const v = (goalX - currentPosX) / deltaT;

      (group as CharacterLayer).updateAnimation(CharacterAnimation.run);

      const moveAni = new Konva.Animation(function (frame) {
        if (!frame) return;

        const newPosX = Math.min(currentPosX + frame?.time * v, goalX);
        group.x(newPosX);

        // check to stop animation
        if (newPosX >= goalX) {
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
