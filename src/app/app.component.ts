import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
  imports: [RouterModule, NavbarComponent]
})
export class AppComponent {
  title = 'ProgettoIngFrontEnd';

  constructor() {
  }
}
