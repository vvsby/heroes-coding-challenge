import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WeaponInterface } from '../interfaces/weapon.interface';
import { MessageService } from '../message.service';
import { WEAPONS } from '../mock';

@Injectable({ providedIn: 'root' })
export class WeaponService {
  constructor(private messageService: MessageService) {
  }

  getWeapons(): Observable<WeaponInterface[]> {
    const weapons = of(WEAPONS);
    this.messageService.add('WeaponService: fetched weapons');
    return weapons;
  }

  getWeapon(id: number): Observable<WeaponInterface> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = WEAPONS.find(w => w.id === id)!;
    this.messageService.add(`WeaponService: fetched weapon id=${id}`);
    return of(hero);
  }
}
