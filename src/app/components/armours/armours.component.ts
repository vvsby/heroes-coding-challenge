import { Component, OnInit } from '@angular/core';
import { ArmourInterface } from '../../interfaces/armour.interface';
import { ArmourService } from '../../services/armour.service';

@Component({
  selector: 'app-armours',
  templateUrl: './armours.component.html',
  styleUrls: ['./armours.component.css'],
})
export class ArmoursComponent implements OnInit {
  armours: ArmourInterface[] = [];

  constructor(private armourService: ArmourService) {
  }

  ngOnInit() {
    this.getArmours();
  }

  getArmours(): void {
    this.armourService.getArmours()
      .subscribe(armours => this.armours = armours);
  }
}
