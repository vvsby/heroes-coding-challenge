import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeroesComponent } from './pages/heroes/heroes.component';
import { HeroDetailComponent } from './pages/hero-detail/hero-detail.component';
import { ArmoursComponent } from './pages/armours/armours.component';
import { WeaponsComponent } from './pages/weapons/weapons.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'heroes', component: HeroesComponent },
  { path: 'hero/detail/:id', component: HeroDetailComponent },

  { path: 'weapons', component: WeaponsComponent },
  // { path: 'weapon/detail/:id', component: HeroDetailComponent },

  { path: 'armours', component: ArmoursComponent },
  // { path: 'armour/detail/:id', component: HeroDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
