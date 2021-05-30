import { Directive, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { ContainerConfig } from 'konva/lib/Container';
import { isEmpty } from 'lodash';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { delay, filter, first, pairwise } from 'rxjs/operators';
import { TimeMoving } from '../configs/config.game';
import { HEROES, HeroImageWidth } from '../configs/mock-heroes';
import { MONSTERS } from '../configs/mock-monster';
import { MessageService } from '../message.service';
import { Hero } from '../models/hero';
import { Match } from '../models/match';
import { Monster } from '../models/monster';
import { PlayService } from '../services/play.service';
import { isOverTurned } from '../utils/character';
import { CharacterLayer, CharacterAnimation } from './CharacterLayer';

const gapCharacterCenter = 70;
@Directive()
export class PlayLayer extends Konva.Layer implements OnDestroy {
  private unSubscribe$ = new Subject();

  //   private heroSubject$ = new BehaviorSubject<Hero[]>({});

  constructor(private playService: PlayService) {
    super();

    this.initPlayer();

    this.startGame();
  }

  initPlayer() {
    // debugger;
    console.log('PlayLayer initPlayer');
    const hero$ = this.layerProvide('hero');
    const monster$ = this.layerProvide('monster', {
      x: 700,
    });

    this.add(hero$);
    this.add(monster$);

    this.playService.init([hero$], [monster$]);
  }

  layerProvide(
    type: 'hero' | 'monster',
    config?: ContainerConfig
  ): CharacterLayer {
    switch (type) {
      case 'hero':
        return new CharacterLayer(of(new Hero(HEROES[0])));
      case 'monster':
        return new CharacterLayer(of(new Monster(MONSTERS[0])), config, true);
    }
  }

  startGame() {
    // setTimeout(() => {
    //   this.goToFightArea();
    // }, 2000);

    this.playService.layers$
      .pipe(
        filter(
          (layers) =>
            !isEmpty(layers.heroLayers) && !isEmpty(layers.monsterLayers)
        ),
        delay(3000),
        first()
      )
      .subscribe(() => {
        // debugger;
        console.log('PlayLayer start game');
        this.playService.startGame();
      });

    this.handleMatch();
  }

  handleMatch() {
    // todo: need to handle case remove match
    this.playService.matchs$
      .pipe(filter((matchs) => !isEmpty(matchs)))
      .subscribe((matchs) => {
        matchs.forEach((match) => {
          // debugger;
          // console.log(match._heroLayers());
          // console.log(match._monsterLayers());

          [...match._heroLayers, ...match._monsterLayers].forEach((layer) => {
            this.goToFightArea(layer, match);
          });
        });
      });
  }

  goToFightArea(characterLayer: CharacterLayer, match: Match) {
    // this.children?.forEach((group) => {
    // let [currentPosX] = characterLayer.getCurrentAndGoalPosX() || [];
    // const currentPo

    let goalX = match.posX;
    let goalY = match.posY;
    let currentPosX = characterLayer.x();

    // note: dont forget multiply with scaleX() to get the right value
    // goalX = goalX + gapCharacterCenter * characterLayer.scaleX();
    goalX = goalX - gapCharacterCenter * characterLayer.scaleX();

    // debugger;
    // if (!is || !goalX) {
    //   console.error('currentPosX or goalX get invalid value');
    //   return;
    // }

    const v = (goalX - currentPosX) / TimeMoving;

    characterLayer.updateAnimation(CharacterAnimation.run);

    const moveAni = new Konva.Animation(function (frame) {
      if (!frame) return;

      let newPosX = currentPosX + frame?.time * v;

      // get the posX
      if (isOverTurned(characterLayer)) {
        newPosX = Math.max(newPosX, goalX);
      } else {
        newPosX = Math.min(newPosX, goalX);
      }

      // const newPosX = Math.min(currentPosX + frame?.time * v, goalX);
      characterLayer.x(newPosX);

      // check to stop animation
      if (
        (isOverTurned(characterLayer) && newPosX <= goalX) ||
        (!isOverTurned(characterLayer) && newPosX >= goalX)
      ) {
        moveAni.stop();
        // start attack on fight area

        match.prepareBattle(characterLayer);
        characterLayer.updateAnimation(CharacterAnimation.attack);
      }
    }, this);

    moveAni.start();
    // });
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
