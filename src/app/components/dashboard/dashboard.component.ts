import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArmourInterface } from '../../interfaces/armour.interface';
import { HeroExtendedInterface, HeroInterface } from '../../interfaces/hero.interface';
import { WeaponInterface } from '../../interfaces/weapon.interface';
import { ArmourService } from '../../services/armour.service';
import { HeroService } from '../../services/hero.service';
import { WeaponService } from '../../services/weapon.service';

/**
 * Dashboard component
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  heroes$: Observable<HeroInterface[]> | undefined;
  selectedHeroes: HeroExtendedInterface[] = [];
  weapons: WeaponInterface[] = [];
  armours: ArmourInterface[] = [];

  constructor(
    private heroService: HeroService,
    private weaponService: WeaponService,
    private armourService: ArmourService,
  ) {
  }

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.loadHeroes();
    this.loadWeaponsAndArmours();
  }

  /**
   * Click by hero handler
   * If hero already on arena - remove them from list active heroes, if not - add
   *
   * @param hero: HeroInterface
   */
  heroClickHandler(hero: HeroInterface) {
    const index = this.selectedHeroes.findIndex(h => h.id === hero.id);

    if (index >= 0) {
      this.selectedHeroes.splice(index, 1);
    } else {
      // ToDo if we will use model instead interface - we can encapsulate all that logic
      const { damage: weaponDamage } = this.weapons.find(w => w.id === hero.weaponId) || { damage: 0 };
      const { health: armourHeals } = this.armours.find(a => a.id === hero.armourId) || { health: 0 };

      const remainingEnergy: number = hero.health + armourHeals;
      const attackDamage: number = weaponDamage;
      const heroExtended: HeroExtendedInterface = { ...hero, remainingEnergy, attackDamage };
      this.selectedHeroes.push(heroExtended);
    }

    this.selectedHeroes = this.selectedHeroes.slice();
  }

  /**
   * Loading heroes from service
   * @private
   */
  private loadHeroes(): void {
    this.heroes$ = this.heroService.getHeroes();
  }

  /**
   * Getting weapons and armours
   * @private
   */
  private loadWeaponsAndArmours() {
    this.weaponService.getWeapons().subscribe(weapons => this.weapons = weapons);
    this.armourService.getArmours().subscribe(armours => this.armours = armours);
  }
}
