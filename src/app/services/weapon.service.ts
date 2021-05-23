import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Weapon } from '../models/weapon';
import { BaseModelService } from './BaseModel.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class WeaponService extends BaseModelService<Weapon> {
  constructor(private storageService: StorageService) {
    super();

    this.initData();
  }

  initData(): void {
    this.storageService.data$
      .pipe(map((data) => data.weapons))
      .subscribe(this.dataSubject$);
  }
}
