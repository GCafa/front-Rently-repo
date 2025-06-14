import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterModule, Router } from '@angular/router';
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'users-visualization',
  templateUrl: './users-visualization.component.html',
  styleUrls: ['./users-visualization.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class usersVisualizationComponent implements OnInit {
  users: UserModel[] = [];
  loading = false;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.handleError('Errore nel caricamento degli utenti');
        this.loading = false;
      }
    });
  }

  getUserStatusText(isActive: boolean): string {
    return isActive ? 'Abilitato' : 'Disabilitato';
  }

  enable(userId: number): void {
    this.userService.enable(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess('Utente abilitato con successo');
      },
      error: () => this.handleError('Errore durante l\'abilitazione dell\'utente')
    });
  }

  disable(userId: number): void {
    this.userService.disable(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess('Utente disabilitato con successo');
      },
      error: () => this.handleError('Errore durante la disabilitazione dell\'utente')
    });
  }

  private showSuccess(message: string): void {
    console.log('Successo:', message);
  }

  private handleError(error: string): void {
    console.error('Errore:', error);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');

    this.router.navigate(['/home'])
      .then(() => {
        location.reload();
      });
  }

  goback(): void {
    this.router.navigate(['/home']);
  }
}
