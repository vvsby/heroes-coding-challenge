import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WeaponInterface } from '../interfaces/weapon.interface';
import { MessageService } from '../message.service';
import { WEAPONS } from '../mock';

/**
 * Weapons service
 *
 * @todo implement all CRUD methods
 */
@Injectable({ providedIn: 'root' })
export class WeaponService {
  constructor(private messageService: MessageService) {
  }

  /**
   * Get all weapons
   *
   * @return Observable<WeaponInterface[]>
   */
  getWeapons(): Observable<WeaponInterface[]> {
    const weapons = of(WEAPONS);
    this.messageService.add('WeaponService: fetched weapons');
    return weapons;
  }

  /**
   * Get weapon by id
   *
   * @param id: number
   * @return Observable<WeaponInterface>
   */
  getWeapon(id: number): Observable<WeaponInterface> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const weapon = WEAPONS.find(w => w.id === id)!;
    this.messageService.add(`WeaponService: fetched weapon id=${id}`);
    return of(weapon);
  }
}
