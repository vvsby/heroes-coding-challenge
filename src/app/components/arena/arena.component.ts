import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Konva from 'konva';
import { HeroInterface } from '../../interfaces/hero.interface';

const KONVA_WIDTH = 1000;
const KONVA_HEIGHT = 1000;
const KONVA_STAGE_CONFIG = {
  container: 'konva-stage',
  width: KONVA_WIDTH,
  height: KONVA_HEIGHT,
};
const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 200;

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
})
export class ArenaComponent implements OnInit, OnChanges {
  @Input() heroes: HeroInterface[] = [];

  private stage: Konva.Stage | undefined;
  private layer: Konva.Layer = new Konva.Layer();

  ngOnInit(): void {
    this.initKonva();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.heroes) {
      this.drawHeroes(this.heroes);
    }
  }

  private initKonva() {
    this.stage = new Konva.Stage(KONVA_STAGE_CONFIG);
    this.stage.add(this.layer);
  }

  private drawHeroes(heroes: HeroInterface[]) {
    let x = 0;
    let y = 0;

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

  private drawHero(hero: HeroInterface, x: number, y: number) {
    const img = new Image();

    img.onload = () => {
      const image = new Konva.Image({
        x,
        y,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        image: img,
      });

      this.layer.add(image);
    };
    img.src = hero.imageSrc ? hero.imageSrc as string : `/assets/img/default.png`;
  }
}
