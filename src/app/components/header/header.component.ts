import { Component, Input } from '@angular/core';
import { MenuInterface } from '../../interfaces/menu.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() title = '';
  @Input() menu: MenuInterface[] = [];
}
