import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { WeaponDetailComponent } from './components/weapon-detail/weapon-detail.component';
import { WeaponsComponent } from './components/weapons/weapons.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'heroes/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'weapons/:id', component: WeaponDetailComponent },
  { path: 'weapons', component: WeaponsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
