import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ArmourInterface } from '../../interfaces/armour.interface';
import { HeroInterface } from '../../interfaces/hero.interface';
import { WeaponInterface } from '../../interfaces/weapon.interface';
import { ArmourService } from '../../services/armour.service';
import { HeroService } from '../../services/hero.service';
import { WeaponService } from '../../services/weapon.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  hero$: Observable<HeroInterface> | undefined;
  weapons$: Observable<WeaponInterface[]> | undefined;
  armours$: Observable<ArmourInterface[]> | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private weaponService: WeaponService,
    private armourService: ArmourService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.getHero();
    this.getWeapons();
    this.getArmours();
  }

  goBack(): void {
    this.location.back();
  }

  private getHero(): void {
    const heroId = Number(this.route.snapshot.paramMap.get('id'));
    this.hero$ = this.heroService.getHero(heroId);
  }

  private getWeapons() {
    this.weapons$ = this.weaponService.getWeapons();
  }

  private getArmours() {
    this.armours$ = this.armourService.getArmours();
  }
}
