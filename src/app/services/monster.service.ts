import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Monster } from '../models/monster';
import { BaseModelService } from './BaseModel.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class MonsterService extends BaseModelService<Monster> {
  constructor(private storageService: StorageService) {
    super();

    this.initData();
  }

  initData(): void {
    this.storageService.data$
      .pipe(map((data) => data.monsters))
      .subscribe(this.dataSubject$);
  }
}
