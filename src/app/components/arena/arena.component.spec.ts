import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeaponInterface } from '../../interfaces/weapon.interface';
import { WEAPONS } from '../../mock';

import { ArenaComponent } from './arena.component';

describe('ArenaComponent', () => {
  let component: ArenaComponent;
  let fixture: ComponentFixture<ArenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArenaComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check weaponSelected', () => {
    component.weapons = WEAPONS;
    component.selectedHero = { attackDamage: 0, remainingEnergy: 100, id: 1, name: 'test hero', health: 100 };
    component.weaponSelected(10);
    expect(component.selectedHero).not.toBeDefined();
  });

  it('check drawing heroes', () => {
    const spy = spyOn<any>(component, 'drawHeroes');
    const heroes = [
      { attackDamage: 0, remainingEnergy: 30, id: 1, name: 'test hero 2', health: 30 },
      { attackDamage: 0, remainingEnergy: 100, id: 2, name: 'test hero', health: 100 },
    ];

    component.heroes = heroes;

    component.ngOnChanges({
      heroes: new SimpleChange(undefined, heroes, false),
    });

    expect(spy).toHaveBeenCalled();
  });

  it('check not drawing heroes', () => {
    const spy = spyOn<any>(component, 'drawHeroes');
    const weapons: WeaponInterface[] = [];

    component.weapons = weapons;

    component.ngOnChanges({
      weapons: new SimpleChange(undefined, weapons, false),
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it('check drawing heroes count', () => {
    const spy = spyOn<any>(component, 'drawHero');
    const heroes = [
      { attackDamage: 0, remainingEnergy: 30, id: 1, name: 'test hero 1', health: 30 },
      { attackDamage: 0, remainingEnergy: 30, id: 2, name: 'test hero 2', health: 30 },
      { attackDamage: 0, remainingEnergy: 30, id: 3, name: 'test hero 3', health: 30 },
      { attackDamage: 0, remainingEnergy: 30, id: 4, name: 'test hero 4', health: 30 },
      { attackDamage: 0, remainingEnergy: 30, id: 5, name: 'test hero 5', health: 30 },
      { attackDamage: 0, remainingEnergy: 30, id: 6, name: 'test hero 6', health: 30 },
      { attackDamage: 0, remainingEnergy: 30, id: 7, name: 'test hero 7', health: 30 },
      { attackDamage: 0, remainingEnergy: 30, id: 8, name: 'test hero 8', health: 30 },
      { attackDamage: 0, remainingEnergy: 30, id: 9, name: 'test hero 9', health: 30 },
    ];

    component.heroes = heroes;

    component.ngOnChanges({
      heroes: new SimpleChange(undefined, heroes, false),
    });

    expect(spy).toHaveBeenCalledTimes(heroes.length);
  });
});

// imageSrc: `https://angular.io/assets/images/logos/angular/angular.svg`,
