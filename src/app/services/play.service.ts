import { Injectable } from '@angular/core';
import { Layer } from 'konva/lib/Layer';
import { cloneDeep, forEach, forIn, isEmpty } from 'lodash';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { mergeMap, switchMap, filter } from 'rxjs/operators';
import { MaxCharacterEachSide } from '../configs/config.game';
import { Character } from '../models/character';
import { Hero } from '../models/hero';
import { Match, MatchStatus } from '../models/match';
import { Monster } from '../models/monster';
import { CharacterLayer } from '../shared/CharacterLayer';
import { getDistanceBetween2Point } from '../utils/character';
import { HeroService } from './hero.service';
import { WeaponService } from './weapon.service';

interface PairCharacterMatch {
  characterLayer: CharacterLayer;
  match: Match;
}

export interface QueueCharacters {
  heroes: Hero[];
  monsters: Monster[];
}

@Injectable({
  providedIn: 'root',
})
export class PlayService {
  layers$ = new BehaviorSubject<{
    heroLayers: CharacterLayer[];
    monsterLayers: CharacterLayer[];
  }>({
    heroLayers: [],
    monsterLayers: [],
  });

  endGame$ = new BehaviorSubject<boolean>(false);

  matchs$ = new BehaviorSubject<Match[]>([]);

  characterComingMatch$ = new BehaviorSubject<PairCharacterMatch[]>([]);

  freeCharacterLayer$ = new BehaviorSubject<CharacterLayer[]>([]);

  queueCharacters$ = new BehaviorSubject<QueueCharacters>({
    heroes: [],
    monsters: [],
  });

  constructor(
    private heroService: HeroService,
    private weaponService: WeaponService
  ) {}

  get queueCharacter(): Observable<QueueCharacters> {
    return this.queueCharacters$.asObservable();
  }

  init(heroLayers: CharacterLayer[], monsterLayers: CharacterLayer[]) {
    console.log('PlayService init');
    this.layers$.next({
      heroLayers,
      monsterLayers,
    });
  }

  startGame() {
    console.log('PlayService startGame');
    const { heroLayers, monsterLayers } = this.layers$.value;
    const { matchs, pairs } = this.createMatchs(heroLayers, monsterLayers);

    console.log('PlayService get matchs', matchs);
    console.log('PlayService get pairs', pairs);

    this.matchs$.next(matchs);
    this.characterComingMatch$.next(pairs);

    this.listenMatch();
    // this.handleFreeCharacterLayer();
  }

  // todo: handle the free character
  // seems like it is wrong
  // handleFreeCharacterLayer() {
  //   this.freeCharacterLayer$
  //     .pipe(filter((layer) => !!layer.length))
  //     .subscribe((layers) => {
  //       const { heroLayers, monsterLayers } = layers.reduce<{
  //         heroLayers: CharacterLayer[];
  //         monsterLayers: CharacterLayer[];
  //       }>(
  //         (memo, layer) => {
  //           if (this.isMonsterLayer(layer)) {
  //             memo.monsterLayers.push(layer);
  //           } else {
  //             memo.heroLayers.push(layer);
  //           }

  //           return memo;
  //         },
  //         {
  //           heroLayers: [],
  //           monsterLayers: [],
  //         }
  //       );

  //       this.createMatchs(heroLayers, monsterLayers);
  //     });
  // }

  isMonsterLayer(layer: CharacterLayer) {
    return layer.character instanceof Monster;
  }

  listenMatch() {
    this.matchs$
      .pipe(
        mergeMap((matchs) => from(matchs)),
        switchMap((match) => combineLatest([match.status$, match.winners$])),
        filter(
          ([status, winners]) => !isEmpty(winners) && status === MatchStatus.end
        )
      )
      .subscribe(([status, winners]) => {
        const playingMatch = this.matchs$.value.filter((match) => !match.isEnd);

        // create new pair for the winner
        // if (!playingMatch.length) {
        //   this.createPair(winners, playingMatch);
        // } else {
        //   this.freeCharacterLayer$.next([
        //     ...this.freeCharacterLayer$.value,
        //     ...winners,
        //   ]);
        // }

        debugger
        if (!playingMatch.length) {
          this.endGame$.next(true);
        }

        this.matchs$.next(playingMatch);
      });
  }

  createMatchs(
    heroLayers: CharacterLayer[],
    monsterLayers: CharacterLayer[]
  ): {
    matchs: Match[];
    pairs: PairCharacterMatch[];
  } {
    // pair chacracter find match
    let pairs: PairCharacterMatch[] = [];

    const heroLength = heroLayers.length;
    const monsterLength = monsterLayers.length;
    const minLength = Math.min(heroLength, monsterLength);

    const matchs = this.getSimpleMatch(
      heroLayers.slice(0, minLength),
      monsterLayers.slice(0, minLength)
    );

    // find the target for free character layer
    if (heroLength !== monsterLength) {
      const biggerLayerArray =
        heroLength > monsterLength ? heroLayers : monsterLayers;

      const freeLayers = biggerLayerArray.slice(
        -Math.abs(heroLength - monsterLength)
      );

      pairs = this.createPair(freeLayers, matchs);
      // freeLayers.forEach((layer) => {
      //   const nearestMatch = this.findNearestMatch(layer, matchs);
      //   if (nearestMatch && layer.character) {
      //     pairs.push({
      //       characterLayer: layer,
      //       match: nearestMatch,
      //     });
      //   }
      // });
    }

    return {
      matchs,
      pairs,
    };
  }

  createPair(layers: CharacterLayer[], matchs: Match[]): PairCharacterMatch[] {
    const pairs: PairCharacterMatch[] = [];

    layers.forEach((layer) => {
      const nearestMatch = this.findNearestMatch(layer, matchs);

      const isExisting = Object.values(this.characterComingMatch$.value).some(
        (pair) => pair.characterLayer.character?.id === layer.character?.id
      );

      if (nearestMatch && layer.character && !isExisting) {
        pairs.push({
          characterLayer: layer,
          match: nearestMatch,
        });
      }
    });

    return pairs;
  }

  addCharacterComingMatch(pair: PairCharacterMatch) {
    const currentValue = this.characterComingMatch$.value;
    this.characterComingMatch$.next([...currentValue, pair]);
  }

  removeCharacterComingMatch(characterLayer: CharacterLayer) {
    const currentValue = this.characterComingMatch$.value;
    const newValue = currentValue.filter(
      (pair) =>
        pair.characterLayer.character?.id !== characterLayer.character?.id
    );
    this.characterComingMatch$.next(newValue);
  }

  /**
   * simple match hero to monster
   */
  getSimpleMatch(
    heroLayers: CharacterLayer[],
    monsterLayers: CharacterLayer[]
  ) {
    const matchs = monsterLayers.map((monsterLayer, index) => {
      const heroLayer = heroLayers[index];
      const posX = Math.abs(monsterLayer.x() + heroLayer.x()) / 2;
      const posY = Math.abs(monsterLayer.y() + heroLayer.y()) / 2;

      return new Match([heroLayer], [monsterLayer], posX, posY);
    });

    return matchs;
  }

  /**
   * when a match finish, a hero or monster need to find another target
   * this method help to find the nearest match
   * @param characterLayer
   * @param matchs
   * @returns
   */
  findNearestMatch(
    characterLayer: CharacterLayer,
    matchs: Match[]
  ): Match | undefined {
    const { match } = matchs.reduce<{
      match: Match | undefined;
      distance: number;
    }>(
      (nearest, match) => {
        const distance = getDistanceBetween2Point(
          characterLayer.x(),
          characterLayer.y(),
          match.posX,
          match.posY
        );

        if (distance < nearest.distance) {
          nearest.match = match;
          nearest.distance = distance;
        }

        return nearest;
      },
      {
        match: undefined,
        distance: Infinity,
      }
    );

    return match;
  }

  updateQueueCharacter(
    type: 'heroes' | 'monsters',
    isAdd = true,
    character: Hero | Monster
  ): void {
    const cloneCharacter = cloneDeep(character);
    const currentQueue = this.queueCharacters$.value;

    let characters = currentQueue[type];

    const isExisting = characters.some((c) => c.id === cloneCharacter.id);
    if (!isAdd && isExisting) {
      // remove this character out of the queue
      const index = characters.findIndex((c) => c.id === cloneCharacter.id);
      characters = characters.filter((c, i) => i !== index);
    } else {
      //  this character out of the queue
      if (characters.length >= MaxCharacterEachSide) {
        alert(`Maximum ${MaxCharacterEachSide} slots`);
        return;
      }

      characters.push(cloneCharacter as any);
    }

    this.queueCharacters$.next({
      ...currentQueue,
      [type]: characters,
    });
  }

  reset() {
    this.layers$.next({
      heroLayers: [],
      monsterLayers: [],
    });

    this.endGame$.next(false);

    this.matchs$.next([]);
    this.characterComingMatch$.next([]);
    this.freeCharacterLayer$.next([]);
    this.queueCharacters$.next({
      heroes: [],
      monsters: [],
    });
  }
}
