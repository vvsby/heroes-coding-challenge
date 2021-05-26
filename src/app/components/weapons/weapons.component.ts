import { Component, OnInit } from '@angular/core';
import { WeaponInterface } from '../../interfaces/weapon.interface';
import { WeaponService } from '../../services/weapon.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css'],
})
export class WeaponsComponent implements OnInit {
  weapons: WeaponInterface[] = [];

  constructor(private weaponService: WeaponService) {
  }

  ngOnInit() {
    this.getWeapons();
  }

  getWeapons(): void {
    this.weaponService.getWeapons()
      .subscribe(weapons => this.weapons = weapons);
  }
}
