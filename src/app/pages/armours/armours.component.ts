import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Armour } from 'src/app/models/armour';
import { ArmourService } from 'src/app/services/armour.service';

@Component({
  selector: 'app-armours',
  templateUrl: './armours.component.html',
  styleUrls: ['./armours.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArmoursComponent {
  armours$: Observable<Armour[]> = of([]);

  constructor(private armourService: ArmourService) {
    this.armours$ = this.armourService.data$;
  }
}
