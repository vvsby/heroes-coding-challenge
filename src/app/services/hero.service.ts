import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { HeroInterface } from '../interfaces/hero.interface';
import { MessageService } from '../message.service';
import { HEROES } from '../mock';

@Injectable({ providedIn: 'root' })
export class HeroService {

  constructor(private messageService: MessageService) {
  }

  getHeroes(): Observable<HeroInterface[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<HeroInterface> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }
}
