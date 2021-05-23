import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Armour } from '../models/armour';
import { BaseModelService } from './BaseModel.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ArmourService extends BaseModelService<Armour> {
  constructor(private storageService: StorageService) {
    super();

    this.initData();
  }

  initData(): void {
    this.storageService.data$
      .pipe(map((data) => data.armours))
      .subscribe(this.dataSubject$);
  }
}
