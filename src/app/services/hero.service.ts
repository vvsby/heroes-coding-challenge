import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Hero } from '../models/hero';
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
