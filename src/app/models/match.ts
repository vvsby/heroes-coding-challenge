import { isNil } from 'lodash';
import { BehaviorSubject, interval, Observable, of, timer } from 'rxjs';
import { filter, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { AttackDelayTime } from '../configs/config.game';
import { CharacterLayer } from '../shared/CharacterLayer';
import { Character } from './character';
import { Hero } from './hero';
import { Monster } from './monster';

export interface IMatchResult {
  alive: Array<Character>;
  dead: Array<Character>;
}

export class Match {
  private heroLayers: CharacterLayer[];
  private monsterLayers: CharacterLayer[];
  posX: number;
  posY: number;

  private isEnd$ = new BehaviorSubject<boolean>(false);
  private _result$ = new BehaviorSubject<IMatchResult | undefined>(undefined);
  result$: Observable<IMatchResult>;

  constructor(
    heroLayers: CharacterLayer[],
    monsterLayers: CharacterLayer[],
    posX: number,
    posY: number
  ) {
    // debugger;
    this.heroLayers = heroLayers;
    this.monsterLayers = monsterLayers;
    this.posX = posX;
    this.posY = posY;

    this.result$ = this._result$
      .asObservable()
      .pipe(filter((result) => !isNil(result))) as Observable<IMatchResult>;

    // this.defFightPosition();
  }

  //   defFightPosition() {
  //     if (this.heroes.length && this.monsters.length) {
  //       const beginHero = this.heroes[0];
  //       const beginMonster = this.monsters[0];
  //     }
  //   }

  //

  get _heroLayers() {
    return this.heroLayers;
  }

  get _monsterLayers() {
    return this.monsterLayers;
  }

  // handle begin character or character finding match
  prepareBattle(characterLayer: CharacterLayer) {
    const layers = [...this.heroLayers, ...this.monsterLayers];
    const characters = layers.map((layer) => layer.character);
    const isExisting = characters.some(
      (c) => c?.id === characterLayer.character?.id
    );

    // if charact hasn't added to match layer, push it
    if (!isExisting) {
      if (characterLayer.character instanceof Hero) {
        this.heroLayers.push(characterLayer);
      } else {
        this.monsterLayers.push(characterLayer);
      }
    }

    // define target and start attack
    const defTargetSuccess = this.defTarget(characterLayer);
    if (defTargetSuccess) {
      this.handleAttack(characterLayer.character!);
    }
  }

  startFight() {
    interval(1000)
      .pipe(takeUntil(this.isEnd$))
      .subscribe(() => {});
  }

  // define a target for chracter
  defTarget(characterLayer: CharacterLayer) {
    const listEnemyLayer = this.isMonster(characterLayer.character!)
      ? this.heroLayers
      : this.monsterLayers;

    if (listEnemyLayer.length) {
      const targetIndex = Math.floor(Math.random() * listEnemyLayer.length);
      characterLayer.character!.target = listEnemyLayer[targetIndex].character;
    }

    return !!characterLayer.character!.target;
  }

  handleAttack(character: Character) {
    interval(AttackDelayTime)
      .pipe(
        switchMap(() => of(character)),
        takeWhile((character: Character) => !!character.isAlive)
      )
      .subscribe(() => {
        character.target?.getDamage(character.realDamage);
      });
  }

  isMonster(character: Character): boolean {
    return character instanceof Monster;
  }
}
