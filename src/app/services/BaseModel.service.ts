import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';

export abstract class BaseModelService<Model extends { id: number }> {
  protected dataSubject$ = new BehaviorSubject<Model[]>([]);

  // constructor(private storageService: StorageService) {}
  constructor() {}

  abstract initData(): void;

  // initData(data: Model[]): void {
  //   this.dataSubject$.next(data)
  // };

  get data$(): Observable<Model[]> {
    return this.dataSubject$.asObservable();
  }

  getItem(id: number): Observable<Model | undefined> {
    return this.data$.pipe(map((data) => data.find((item) => item.id === id)));
  }
}
