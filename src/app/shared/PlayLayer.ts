import { Directive, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { ContainerConfig } from 'konva/lib/Container';
import { isEmpty } from 'lodash';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { delay, filter, first, pairwise, takeUntil } from 'rxjs/operators';
import { MaxCharacterEachSide, TimeMoving } from '../configs/config.game';
import { HEROES } from '../configs/mock-heroes';
import { MONSTERS } from '../configs/mock-monster';
import { MessageService } from '../message.service';
import { Character } from '../models/character';
import { Hero } from '../models/hero';
import { Match, MatchStatus } from '../models/match';
import { Monster } from '../models/monster';
import { PlayService } from '../services/play.service';
import { getDistanceBetween2Point, isOverTurned } from '../utils/character';
import { CharacterLayer, CharacterAnimation } from './CharacterLayer';

const gapCharacterCenter = 70;
@Directive()
export class PlayLayer extends Konva.Layer implements OnDestroy {
  private unSubscribe$ = new Subject();

  //   private heroSubject$ = new BehaviorSubject<Hero[]>({});

  constructor(private playService: PlayService) {
    super();

    // this.initPlayer();

    this.startGame();
  }

  genPosition(overTurn = false): Array<{ x: number; y: number }> {
    // if (!this.getStage()) {
    //   return;
    // }

    const { width, height } = this.getStage().getAttrs();
    return new Array(MaxCharacterEachSide).fill(undefined).map((i, index) =>
      overTurn
        ? {
            x: width * 0.7,
            y: (index + 1) * 0.1 * height,
          }
        : {
            x: width * 0.1,
            y: (index + 1) * 0.1 * height,
          }
    );
  }

  initPlayer(heroes: Hero[], monsters: Monster[]) {
    const heroPositions = this.genPosition();
    const monsterPositions = this.genPosition(true);

    // create configs for position and scale
    const [heroConfigs, monsterConfigs] = [heroPositions, monsterPositions].map(
      (type) =>
        type.map((position) => ({
          ...position,
          scaleX: 0.5,
          scaleY: 0.5,
        }))
    );

    const heroLayers = heroes.map((hero, index) => {
      debugger;
      return this.layerProvide('hero', hero, heroConfigs[index]);
    });

    const monsterLayers: CharacterLayer[] = monsters.map((monster, index) => {
      debugger;
      return this.layerProvide('monster', monster, monsterConfigs[index]);
    });

    // I think duplicate / copy-paste code is ok here
    heroLayers.forEach((layer) => {
      this.add(layer);
    });

    monsterLayers.forEach((layer) => {
      this.add(layer);
    });

    this.playService.init(heroLayers, monsterLayers);
  }

  layerProvide(
    type: 'hero' | 'monster',
    character: Character,
    config?: ContainerConfig
  ): CharacterLayer {
    if (type === 'hero') {
      return new CharacterLayer(of(character), config);
    }

    return new CharacterLayer(of(character), config, true);
  }

  startGame() {
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
        console.log('PlayLayer start game');
        this.playService.startGame();
      });

    this.handleMatch();
  }

  handleMatch() {
    // todo: need to handle case remove match
    this.playService.matchs$
      .pipe(
        filter((matchs) => !isEmpty(matchs)),
        takeUntil(this.unSubscribe$)
      )
      .subscribe((matchs) => {
        matchs.forEach((match) => {
          if (match.status !== MatchStatus.end) {
            [...match._heroLayers, ...match._monsterLayers].forEach((layer) => {
              this.goToFightArea(layer, match);
            });
          }
        });
      });

    this.playService.characterComingMatch$
      .pipe(
        filter((pairs) => !isEmpty(pairs)),
        takeUntil(this.unSubscribe$)
      )
      .subscribe((pairs) => {
        pairs.forEach((pair) => {
          this.goToFightArea(pair.characterLayer, pair.match);
        });
      });
  }

  goToFightArea(characterLayer: CharacterLayer, match: Match) {
    let goalX = match.posX;
    let goalY = match.posY;
    let currentPosX = characterLayer.x();
    let currentPosY = characterLayer.y();

    // note: dont forget multiply with scaleX() to get the right value
    goalX = goalX - gapCharacterCenter * characterLayer.scaleX();

    // I don't know why the chracter go up about 20px (may be it come from the health bar)
    goalY = goalY + 50;

    const vx = (goalX - currentPosX) / TimeMoving;
    const vy = (goalY - currentPosY + Math.random() * 10 - 5) / TimeMoving;

    characterLayer.updateAnimation(CharacterAnimation.run);

    const moveAni = new Konva.Animation(function (frame) {
      if (!frame) return;

      let newPosX = currentPosX + frame?.time * vx;
      let newPosY = currentPosY + frame?.time * vy;

      console.log(newPosY);

      // get the posX
      if (isOverTurned(characterLayer)) {
        newPosX = Math.max(newPosX, goalX);
        // newPosY = Math.max(newPosY, goalY);
      } else {
        newPosX = Math.min(newPosX, goalX);
      }

      newPosY = Math.max(0, newPosY);

      characterLayer.setAttrs({
        x: newPosX,
        y: newPosY,
      });

      // check to stop animation
      if (
        (isOverTurned(characterLayer) && newPosX <= goalX) ||
        (!isOverTurned(characterLayer) && newPosX >= goalX)
      ) {
        console.log(match);
        moveAni.stop();

        // start attack on fight area
        match.prepareBattle(characterLayer);
        characterLayer.updateAnimation(CharacterAnimation.attack);
        characterLayer.onAttack();
      }
    }, this);

    moveAni.start();
  }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
