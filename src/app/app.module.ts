import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArenaComponent } from './components/arena/arena.component';
import { ArmourDetailComponent } from './components/armour-detail/armour-detail.component';
import { ArmoursComponent } from './components/armours/armours.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { MessagesComponent } from './components/messages/messages.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { WeaponDetailComponent } from './components/weapon-detail/weapon-detail.component';
import { WeaponsComponent } from './components/weapons/weapons.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    WeaponsComponent,
    WeaponDetailComponent,
    ArmoursComponent,
    ArmourDetailComponent,
    MessagesComponent,
    HeaderComponent,
    PageNotFoundComponent,
    ArenaComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
