import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user-model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {ApiPathUtil} from '../../utils/ApiPathUtil';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  user?: UserModel;
  loading: boolean = true;
  errorMessage: string = '';
  isHost: boolean = false;
  isClient: boolean = false;


  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.isHost = user.role === 'HOST';
        this.isClient = user.role === 'CLIENT';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento dell’utente';
        this.loading = false;
      }
    });
  }


  onImageError(): void {
    if (this.user) {
      this.user.imageUrl = 'defaultProfileImage.png';
    }
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/home']).then(() => location.reload());
  }

  protected readonly ApiPathUtil = ApiPathUtil;
}
