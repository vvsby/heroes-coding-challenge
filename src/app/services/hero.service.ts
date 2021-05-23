// import { Injectable } from '@angular/core';

// import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { Hero } from '../models/hero';
// import { HEROES } from '../configs/mock-heroes';
// import { MessageService } from '../message.service';
// import { StorageService } from './storage.service';

// @Injectable({ providedIn: 'root' })
// export class HeroService {
//   constructor(
//     private messageService: MessageService,
//     private storageService: StorageService
//   ) {}

//   getHeroes(): Observable<Hero[]> {
//     return this.storageService.data$.pipe(map((data) => data.heroes));
//   }

//   getHero(id: number): Observable<Hero | undefined> {
//     return this.storageService.data$.pipe(
//       map((data) => data.heroes.find((hero) => hero.id === id))
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Hero } from '../models/hero';
import { Weapon } from '../models/weapon';
import { BaseModelService } from './BaseModel.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class HeroService extends BaseModelService<Hero> {
  constructor(private storageService: StorageService) {
    super();

    this.initData();
  }

  initData(): void {
    this.storageService.data$
      .pipe(map((data) => data.heroes))
      .subscribe(this.dataSubject$);
  }
}
