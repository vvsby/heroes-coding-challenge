import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Weapon } from 'src/app/models/weapon';
import { WeaponService } from 'src/app/services/weapon.service';

@Component({
  selector: 'app-weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeaponsComponent {
  weapons$: Observable<Weapon[]> = of([]);

  constructor(private heroService: WeaponService) {
    this.weapons$ = this.heroService.data$;
  }
}
