import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Weapon } from '../weapon';
import { WeaponService } from '../weapon.service';

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.css'],
})
export class WeaponDetailComponent implements OnInit {
  weapon: Weapon | undefined;

  constructor(
    private route: ActivatedRoute,
    private weaponService: WeaponService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.getWeapon();
  }

  getWeapon(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.weaponService.getWeapon(id)
      .subscribe(weapon => this.weapon = weapon);
  }

  goBack(): void {
    this.location.back();
  }
}
