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
  currentUser: UserModel | null = null;
  users: UserModel [] = [];
  filteredUsers: UserModel[] = [];
  loading = false;
  showRejectionForm = false;
  errorMessage: string = '';
  selectedRequestId: number | null = null;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
        this.loading = false;
      }
    });
  }

  searchUsers(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    searchTerm = searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.firstname.toLowerCase().includes(searchTerm) ||
      user.lastname.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
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
}
