import { AfterViewInit, Component, OnInit } from '@angular/core';
import Konva from 'konva';
import { BehaviorSubject, of } from 'rxjs';
import { HeroLayer } from 'src/app/shared/HeroLayer';
import { PlayLayer } from 'src/app/shared/PlayLayer';
import { Hero } from '../../models/hero';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  heroes: Hero[] = [];

  // readonly canvasId = 'container';

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  ngAfterViewInit() {
    this.setupCanvas();
  }

  setupCanvas() {
    const container = document.querySelector('#container');
    const stage = new Konva.Stage({
      container: 'container',
      width: container?.clientWidth,
      height: 600,
    });

    const knight$ = new BehaviorSubject<Hero>(this.heroes[0]);
    const playerLayer = new PlayLayer();
    // const heroLayer = new HeroLayer(knight$, {
    //   x: 0,
    // } as any);
    // playerLayer.add(heroLayer);
    stage.add(playerLayer);

    // setTimeout(() => {
    //   const newHero = this.heroes[0];
    //   newHero.health = 120;
    //   knight$.next(newHero);
    // }, 3000);
  }

  getHeroes(): void {
    this.heroService.data$.subscribe((heroes) => (this.heroes = heroes));
  }
}
