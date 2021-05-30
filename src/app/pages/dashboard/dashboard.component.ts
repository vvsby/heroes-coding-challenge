import { AfterViewInit, Component, OnInit } from '@angular/core';
import Konva from 'konva';
import { BehaviorSubject, of } from 'rxjs';
import { PlayService } from 'src/app/services/play.service';
import { CharacterLayer } from 'src/app/shared/CharacterLayer';
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

  constructor(
    private heroService: HeroService,
    private playService: PlayService
  ) {}

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

    const playerLayer = new PlayLayer(this.playService);
    stage.add(playerLayer);
  }

  getHeroes(): void {
    this.heroService.data$.subscribe((heroes) => (this.heroes = heroes));
  }
}
