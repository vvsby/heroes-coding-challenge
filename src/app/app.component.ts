import { Component } from '@angular/core';
import { MenuInterface } from './interfaces/menu.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Tour of Heroes';
  menu: MenuInterface[] = [
    { route: '/dashboard', title: 'Dashboard' },
    { route: '/heroes', title: 'Heroes' },
    { route: '/weapons', title: 'Weapons' },
    { route: '/armours', title: 'Armours' },
  ];
}
