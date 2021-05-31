import { Injectable } from '@angular/core';
import { forEach, forIn } from 'lodash';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { mergeMap, switchMap, filter } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root',
})
export class PlayService {
  //   currentHero$ = new BehaviorSubject<CharacterLayer[]>([]);
  //   currentMonster$ = new BehaviorSubject<CharacterLayer[]>([]);

  layers$ = new BehaviorSubject<{
    heroLayers: CharacterLayer[];
    monsterLayers: CharacterLayer[];
  }>({
    heroLayers: [],
    monsterLayers: [],
  });

  matchs$ = new BehaviorSubject<Match[]>([]);

  characterComingMatch$ = new BehaviorSubject<PairCharacterMatch[]>([]);

  constructor(
    private heroService: HeroService,
    private weaponService: WeaponService
  ) {}

  init(heroLayers: CharacterLayer[], monsterLayers: CharacterLayer[]) {
    console.log('PlayService init');
    // debugger;
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

    // debugger;

    this.matchs$.next(matchs);
    this.characterComingMatch$.next(pairs);

    this.listenMatch();
  }

  listenMatch() {
    this.matchs$
      .pipe(
        mergeMap((matchs) => from(matchs)),
        switchMap((match) => match.status$),
        filter((status) => status === MatchStatus.end)
      )
      .subscribe(() => {
        const playingMatch = this.matchs$.value.filter((match) => !match.isEnd);
        const doneMatch = this.matchs$.value.filter((match) => match.isEnd);
        // doneMatch.forEach(match => {
        //   const freeLayers = match._heroLayers
        // })

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
    const pairs: PairCharacterMatch[] = [];

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

      freeLayers.forEach((layer) => {
        const nearestMatch = this.findNearestMatch(layer, matchs);
        if (nearestMatch && layer.character) {
          pairs.push({
            characterLayer: layer,
            match: nearestMatch,
          });
        }
      });
    }

    return {
      matchs,
      pairs,
    };
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

  //   createNearestMatch(
  //     findingLayers: CharacterLayer[],
  //     targetLayers: CharacterLayer[]
  //   ): Match[] {
  //     const matchs = monsterLayers.map((monsterLayer, index) => {
  //       const heroLayer = heroLayers[index];

  //       const hero = heroLayer.character as Hero;
  //       const monster = monsterLayer.character as Monster;

  //       // const distance = getDistanceBetween2Point(heroLayer.x(), heroLayer.y(), monsterLayer.x(), monsterLayer.y())
  //       const posX = Math.abs(monsterLayer.x() - heroLayer.x()) / 2;
  //       const posY = Math.abs(monsterLayer.y() - heroLayer.y()) / 2;

  //       return new Match([hero], [monster], posX, posY);
  //     });

  //     return matchs;
  //   }

  /**
   * simple match hero to monster
   */
  getSimpleMatch(
    heroLayers: CharacterLayer[],
    monsterLayers: CharacterLayer[]
  ) {
    const matchs = monsterLayers.map((monsterLayer, index) => {
      const heroLayer = heroLayers[index];

      const hero = heroLayer.character as Hero;
      const monster = monsterLayer.character as Monster;

      // const distance = getDistanceBetween2Point(heroLayer.x(), heroLayer.y(), monsterLayer.x(), monsterLayer.y())
      const posX = Math.abs(monsterLayer.x() - heroLayer.x()) / 2;
      const posY = Math.abs(monsterLayer.y() - heroLayer.y()) / 2;

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
}
