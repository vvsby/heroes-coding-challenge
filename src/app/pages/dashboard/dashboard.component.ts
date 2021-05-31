import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import Konva from 'konva';
import { isEmpty } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, filter, first } from 'rxjs/operators';
import { MaxCharacterEachSide } from 'src/app/configs/config.game';
import { Monster } from 'src/app/models/monster';
import { MonsterService } from 'src/app/services/monster.service';
import { PlayService } from 'src/app/services/play.service';
import { PlayLayer } from 'src/app/shared/PlayLayer';
import { fullFillArray } from 'src/app/utils/common.util';
import { Hero } from '../../models/hero';
import { HeroService } from '../../services/hero.service';

enum GameState {
  prepare,
  running,
  finished,
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, AfterViewInit {
  unsubscribe$ = new Subject();
  heroes: Hero[] = [];
  monsters: Monster[] = [];
  playerLayer$ = new BehaviorSubject<PlayLayer | undefined>(undefined);
  gameState: GameState = GameState.prepare;
  _gameState = GameState;

  constructor(
    public heroService: HeroService,
    public monsterService: MonsterService,
    private playService: PlayService
  ) {}

  ngOnInit() {}

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
    this.playerLayer$.next(playerLayer);
    stage.add(playerLayer);
  }

  // start fight when a game is not running
  onFight() {
    this.playService.queueCharacters$
      .pipe(
        filter(
          (queue) =>
            !isEmpty(queue.heroes) &&
            !isEmpty(queue.monsters) &&
            this.gameState !== GameState.running
        ),
        first()
      )
      .subscribe((queue) => {
        this.gameState = GameState.running;
        this.playerLayer$.value?.initPlayer(queue.heroes, queue.monsters);
      });
  }

  // choose a character
  onSelect(type: 'heroes' | 'monsters', character: Hero | Monster) {
    this.playService.updateQueueCharacter(type, true, character);
  }

  // remove a character
  onRemove(type: 'heroes' | 'monsters', character: Hero | Monster) {
    this.playService.updateQueueCharacter(type, false, character);
  }

  get heroSelected$() {
    return this.playService.queueCharacter.pipe(
      map((queue) => fullFillArray(MaxCharacterEachSide, queue.heroes))
    );
  }

  get monsterSelected$() {
    return this.playService.queueCharacter.pipe(
      map((queue) => fullFillArray(3, queue.monsters))
    );
  }
}
