import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import Konva from 'konva';
import { timer } from 'rxjs';
import { HeroExtendedInterface } from '../../interfaces/hero.interface';
import { WeaponInterface } from '../../interfaces/weapon.interface';

const KONVA_WIDTH = 1000;
const KONVA_HEIGHT = 1000;
/**
 * Konva stage config
 */
const KONVA_STAGE_CONFIG = {
  container: 'konva-stage',
  width: KONVA_WIDTH,
  height: KONVA_HEIGHT,
};
const IMAGE_WIDTH = 180;
const IMAGE_HEIGHT = 180;
const IMAGE_BORDER = 10;

/**
 * Arena component
 */
@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
})
export class ArenaComponent implements OnInit, OnChanges {
  // ToDo for changes in state better use NgRx
  @Input() heroes: HeroExtendedInterface[] = [];
  @Output() heroesChange: EventEmitter<HeroExtendedInterface[]> = new EventEmitter<HeroExtendedInterface[]>();
  @Input() weapons: WeaponInterface[] = [];

  /**
   * ToDo move konva logic to separated service
   */
  selectedHero: HeroExtendedInterface | undefined;
  private stage: Konva.Stage | undefined;
  private layer: Konva.Layer = new Konva.Layer();

  /**
   * @inheritDoc
   */
  ngOnInit(): void {
    this.initKonva();
    this.initTimer();
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.heroes) {
      this.drawHeroes(this.heroes);
    }
  }

  /**
   * Method for change weapon for hero from arena
   * @param weaponId: number | string
   */
  weaponSelected(weaponId: string | number) {
    const { damage } = this.weapons.find(w => w.id === +weaponId) || { damage: 0 };

    this.selectedHero!.attackDamage = damage;
    this.selectedHero = undefined;
  }

  /**
   * Initialization Konva stage
   * @private
   */
  private initKonva() {
    this.stage = new Konva.Stage(KONVA_STAGE_CONFIG);
    this.stage.add(this.layer);
  }

  /**
   * Drawing heroes on arena (layout)
   * @param heroes: HeroExtendedInterface[]
   * @private
   */
  private drawHeroes(heroes: HeroExtendedInterface[]) {
    let x = 10;
    let y = 10;

    this.layer.destroyChildren();

    heroes.forEach(hero => {
      this.drawHero(hero, x, y);
      x += IMAGE_WIDTH;
      if (x >= KONVA_WIDTH) {
        x = 0;
        y += IMAGE_HEIGHT;
      }
    });

    this.layer.draw();
  }

  /**
   * Initializer for fight timer
   * @private
   */
  private initTimer() {
    timer(0, 1000).subscribe(() => this.fight());
  }

  /**
   * Fight method calculate damage for every hero on arena
   * @private
   */
  private fight() {
    const allHeroesDamage = this.heroes.reduce((result, hero) => result + hero.attackDamage, 0);

    this.heroes = this.heroes
      .map(h => {
        const currentDamage = allHeroesDamage - h.attackDamage;

        h.remainingEnergy -= currentDamage;

        return h;
      })
      .filter(h => h.remainingEnergy > 0);
    this.heroesChange.emit(this.heroes);

    // FixMe draw when changes happens
    this.drawHeroes(this.heroes);
  }

  /**
   * Draw hero on arena layer
   * @param hero
   * @param x
   * @param y
   * @private
   */
  private drawHero(hero: HeroExtendedInterface, x: number, y: number) {
    const img = new Image();

    img.onload = () => {
      const group = new Konva.Group({ x, y });
      this.layer.add(group);

      const image = new Konva.Image({
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        image: img,
        stroke: (hero.remainingEnergy < 50) ? 'red' : '',
        strokeWidth: IMAGE_BORDER,
      });
      group.add(image);

      image.on(`click`, () => {
        this.selectedHero = hero;
      });

      const text = new Konva.Text({
        text: `${hero.name} (${hero.remainingEnergy} | ${hero.attackDamage})`,
        fontSize: 16,
        x: IMAGE_BORDER,
        y: IMAGE_BORDER,
      });
      group.add(text);
    };
    img.src = hero.imageSrc ? hero.imageSrc as string : `/assets/img/default.png`;
  }
}
