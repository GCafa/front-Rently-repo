// recharge-balance.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../models/user-model';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-recharge-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './recharge-balance.component.html',
  styleUrls: ['./recharge-balance.component.css']
})
export class RechargeBalanceComponent implements OnInit {
  amount: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  currentUser: UserModel | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento dei dati utente';
      }
    });
  }

  rechargeBalance(): void {
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'L\'importo deve essere maggiore di 0';
      return;
    }

    if (!this.currentUser?.username) {
      this.errorMessage = 'Utente non trovato';
      return;
    }

    const amountValue = Math.round(this.amount * 100) / 100;
    if (isNaN(amountValue)) {
      this.errorMessage = 'Importo non valido';
      return;
    }

    this.userService.rechargeBalance(this.currentUser.username, amountValue).subscribe({
      next: () => {
        this.successMessage = 'Ricarica effettuata con successo';
        this.loadUserData();
        this.amount = 0;
        this.errorMessage = '';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Errore durante la ricarica';
        this.successMessage = '';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
