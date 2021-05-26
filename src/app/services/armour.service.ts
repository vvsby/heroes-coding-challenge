import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ArmourInterface } from '../interfaces/armour.interface';
import { MessageService } from '../message.service';
import { ARMOURS } from '../mock';

@Injectable({ providedIn: 'root' })
export class ArmourService {
  constructor(private messageService: MessageService) {
  }

  getArmours(): Observable<ArmourInterface[]> {
    const armours = of(ARMOURS);
    this.messageService.add('ArmourService: fetched armours');
    return armours;
  }

  getArmour(id: number): Observable<ArmourInterface> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const armour = ARMOURS.find(a => a.id === id)!;
    this.messageService.add(`ArmourService: fetched armour id=${id}`);
    return of(armour);
  }
}
