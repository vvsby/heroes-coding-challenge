import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HeroInterface } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  heroes$: Observable<HeroInterface[]> | undefined;
  selectedHeroes: HeroInterface[] = [];

  constructor(private heroService: HeroService) {
  }

  ngOnInit() {
    this.loadHeroes();
  }

  loadHeroes(): void {
    this.heroes$ = this.heroService.getHeroes();
  }

  heroClickHandler(hero: HeroInterface) {
    const index = this.selectedHeroes.findIndex(h => h === hero);

    if (index >= 0) {
      this.selectedHeroes.splice(index, 1);
    } else {
      this.selectedHeroes.push(hero);
    }

    this.selectedHeroes = this.selectedHeroes.slice();
  }
}
