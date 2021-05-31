import { cloneDeep, isEmpty } from 'lodash';
import { BehaviorSubject, from, interval, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  takeWhile,
} from 'rxjs/operators';
import { AttackDelayTime } from '../configs/config.game';
import { CharacterLayer } from '../shared/CharacterLayer';
import { Character } from './character';
import { Hero } from './hero';
import { Monster } from './monster';

export interface IMatchResult {
  alive: Array<CharacterLayer>;
  dead: Array<CharacterLayer>;
}

export enum MatchStatus {
  preparing,
  battling,
  end,
}

export class Match {
  private heroLayers: CharacterLayer[];
  private monsterLayers: CharacterLayer[];
  posX: number;
  posY: number;

  private _status$ = new BehaviorSubject<MatchStatus>(MatchStatus.preparing);
  status$: Observable<MatchStatus>;

  winners$ = new BehaviorSubject<CharacterLayer[]>([]);

  currentLayers$ = new BehaviorSubject<{
    heroLayers: CharacterLayer[];
    monsterLayers: CharacterLayer[];
  }>({
    heroLayers: [],
    monsterLayers: [],
  });

  constructor(
    heroLayers: CharacterLayer[],
    monsterLayers: CharacterLayer[],
    posX: number,
    posY: number
  ) {
    this.heroLayers = heroLayers;
    this.monsterLayers = monsterLayers;
    this.posX = posX;
    this.posY = posY;

    this.status$ = this._status$.asObservable();

    this.listenCharacterHp();

    this.currentLayers$.next({
      heroLayers: this.heroLayers,
      monsterLayers: this.monsterLayers,
    });

    this.winners$.pipe(filter((winners) => !isEmpty(winners))).subscribe(() => {
      this._status$.next(MatchStatus.end);
    });
  }

  get _heroLayers() {
    return this.heroLayers;
  }

  get _monsterLayers() {
    return this.monsterLayers;
  }

  get status() {
    return this._status$.value;
  }

  get isEnd() {
    return this.status === MatchStatus.end;
  }

  listenCharacterHp() {
    this.currentLayers$
      .pipe(
        mergeMap((data) => from([...data.heroLayers, ...data.monsterLayers])),
        mergeMap((characterLayer) => characterLayer.character?.isAlive$!),
        filter((isAlive) => !isAlive && this.status !== MatchStatus.end)
      )
      .subscribe(() => {
        // dont deep clone the observable
        const currentLayer = this.currentLayers$.value;

        // remove the dead layer
        for (const type in currentLayer) {
          let _type = type as 'heroLayers' | 'monsterLayers';
          let layers = currentLayer[_type];
          layers = layers.filter((layer) => layer.character?.isAlive);
          currentLayer[_type] = layers;
        }

        if (
          isEmpty(currentLayer.heroLayers) ||
          isEmpty(currentLayer.monsterLayers)
        ) {
          console.log('battle done');
          const freeLayers = currentLayer.heroLayers.length
            ? currentLayer.heroLayers
            : currentLayer.monsterLayers;
          this.winners$.next(freeLayers);
        }

        this.currentLayers$.next(currentLayer);
      });
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

        this.currentLayers$.next({
          ...this.currentLayers$.value,
          heroLayers: this.heroLayers,
        });
      } else {
        this.monsterLayers.push(characterLayer);

        this.currentLayers$.next({
          ...this.currentLayers$.value,
          monsterLayers: this.monsterLayers,
        });
      }
    }

    // define target and start attack
    const defTargetSuccess = this.defTarget(characterLayer);
    if (defTargetSuccess) {
      if (this.status !== MatchStatus.battling) {
        this._status$.next(MatchStatus.battling);
      }

      this.handleAttack(characterLayer.character!);
    }
  }

  // startFight() {
  //   interval(1000)
  //     .pipe(takeUntil(this.isEnd$))
  //     .subscribe(() => {});
  // }

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
        takeWhile(
          (character: Character) =>
            !!character.isAlive && !!character.target?.currentHpPercent
        )
      )
      .subscribe(() => {
        character.target?.getDamage(character.realDamage);
      });
  }

  isMonster(character: Character): boolean {
    return character instanceof Monster;
  }
}
