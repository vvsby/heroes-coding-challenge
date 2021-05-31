import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import Konva from 'konva';
import { isEmpty, isNil } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, filter, first, takeUntil, switchMap } from 'rxjs/operators';
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
  playerLayer$ = new BehaviorSubject<PlayLayer | undefined>(undefined);

  gameState: GameState = GameState.prepare;
  _gameState = GameState;

  stage: Konva.Stage | undefined = undefined;

  constructor(
    public heroService: HeroService,
    public monsterService: MonsterService,
    private playService: PlayService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.setupCanvas();
    this.setupGame();
    this.listenEndGame();
  }

  listenEndGame() {
    this.playService.endGame$
      .pipe(filter((isEndGame) => !!isEndGame))
      .subscribe(() => {
        this.gameState = GameState.finished;
        this.ref.detectChanges();
      });
  }

  setupCanvas() {
    const container = document.querySelector('#container');
    this.stage = new Konva.Stage({
      container: 'container',
      width: 1000,
      height: 411,
    });

    const groundLayer = new Konva.Layer();
    var groundImageObj = new Image();
    const { width, height } = this.stage.getAttrs();
    groundImageObj.onload = function () {
      const groundImg = new Konva.Image({
        x: 0,
        y: 0,
        image: groundImageObj,
        width: width,
        height: height,
      });

      // add the shape to the layer
      groundLayer.add(groundImg);
    };

    groundImageObj.src = '/assets/ground.jpg';

    this.stage.add(groundLayer);
  }

  // reuse for case play again
  setupGame() {
    const playerLayer = new PlayLayer(this.playService);
    this.playerLayer$.next(playerLayer);
    this.stage?.add(playerLayer);
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
        this.ref.detectChanges();
      });
  }

  onPlayAgain() {
    const currentPlayLayer = this.playerLayer$.value;
    currentPlayLayer?.destroy();

    this.playService.reset();
    this.setupGame();
    this.gameState = GameState.prepare;
    this.ref.detectChanges();
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
