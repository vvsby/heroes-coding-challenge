import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { WEAPONS } from './mock';
import { Weapon } from './weapon';

@Injectable({ providedIn: 'root' })
export class WeaponService {
  constructor(private messageService: MessageService) {
  }

  getWeapons(): Observable<Weapon[]> {
    const weapons = of(WEAPONS);
    this.messageService.add('WeaponService: fetched weapons');
    return weapons;
  }

  getWeapon(id: number): Observable<Weapon> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = WEAPONS.find(w => w.id === id)!;
    this.messageService.add(`WeaponService: fetched weapon id=${id}`);
    return of(hero);
  }
}
