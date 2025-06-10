import {Component, OnInit} from "@angular/core";
import {UserModel} from "../../models/user-model";
import {UserService} from "../../services/user.service";
import {NavbarComponent} from "../navbar/navbar.component";
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent, NavbarComponent]
})

export class ProfileComponent implements OnInit {
  user?: UserModel;
  loading = true;
  errorMessage = '';
  userRole: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    }


  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        console.log(this.user.imageUrl);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Errore nel caricamento utente';
        this.loading = false;
      }
    });
  }

  onImageError() {
    if (this.user) {
      this.user.imageUrl = '';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');

    this.router.navigate(['/home'])
      .then(() => {
        location.reload();
      });
  }

}

