import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ARMOURS } from '../configs/mock-armour';
import { HEROES } from '../configs/mock-heroes';
import { WEAPONS } from '../configs/mock-weapons';
import { localStorageKeys } from '../constant';
import { MessageService } from '../message.service';
import { Armour } from '../models/armour';
import { Hero } from '../models/hero';
import { Weapon } from '../models/weapon';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private dataSubject$ = new BehaviorSubject<LocaleDataDto>(
    LocaleDataDto.getDefault()
  );

  data$: Observable<LocaleDataDto>;

  constructor(private messageService: MessageService) {
    // const localStorageData = localStorage.
    this.data$ = this.dataSubject$.asObservable();

    const localHeroes = localStorage.getItem(localStorageKeys.heroes);
    const heroes = this.mergeDataToDefault(localHeroes, HEROES);

    const localArmours = localStorage.getItem(localStorageKeys.armours);
    const armours = this.mergeDataToDefault(localArmours, ARMOURS);

    const localWeapons = localStorage.getItem(localStorageKeys.weapons);
    const weapons = this.mergeDataToDefault(localWeapons, WEAPONS);

    const currentRound = localStorage.getItem(localStorageKeys.round) || '1';

    const data: LocaleDataDto = {
      heroes,
      armours,
      weapons,

      round: Number(currentRound),
      playerState: {},
    };

    this.dataSubject$.next(data);
  }

  /**
   * To avoid the user cheat the localstorage
   * make sure just update the fields that editable
   *
   * @param localStorageData stringify data that get from local storage
   * @param defaultListData List data default that define by developer - author
   * @returns return the List data with local field's value
   */
  mergeDataToDefault<T extends { id: number }>(
    localStorageData: string | null,
    defaultListData: Array<T>
  ) {
    if (!localStorageData) return defaultListData;

    const parsedData = JSON.parse(localStorageData) as BaseModelStorage[];

    return defaultListData.map((item) => {
      const localItem = parsedData.find((d) => d.id === item.id);

      return {
        ...item,
        // todo: update the editable field here
        name: localItem?.name,
      };
    });
  }

  get data(): LocaleDataDto {
    return this.dataSubject$.value;
  }

  get heroes(): Array<Hero> {
    return this.data.heroes;
  }

  get weapons(): Array<Weapon> {
    return this.data.weapons;
  }

  get armours(): Array<Armour> {
    return this.data.armours;
  }
}

interface BaseModelStorage {
  id: number;
  name: string;
}

class LocaleDataDto {
  heroes: Hero[];
  armours: Armour[];
  weapons: Weapon[];

  round: number;

  playerState: any;

  static getDefault() {
    return new LocaleDataDto({
      heroes: HEROES,
      armours: ARMOURS,
      weapons: WEAPONS,
      round: 1,
      playerState: {},
    });
  }

  constructor(params: {
    heroes: Hero[];
    armours: Armour[];
    weapons: Weapon[];
    round: number;
    playerState: any;
  }) {
    const { heroes, armours, weapons, round, playerState } = params;
    this.heroes = heroes;
    this.armours = armours;
    this.weapons = weapons;
    this.round = round;
    this.playerState = playerState;
  }
}
