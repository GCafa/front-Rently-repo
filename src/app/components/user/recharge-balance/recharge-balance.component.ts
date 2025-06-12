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
  username: string = '';
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
        console.log('Utente caricato:', user);
        this.currentUser = user;
        this.username = user.username;
        console.log('Username salvato:', this.username);
      },
      error: (error) => {
        console.error('Errore caricamento:', error);
        this.errorMessage = 'Errore nel caricamento dei dati utente';
      }
    });
  }

  rechargeBalance(): void {
    console.log('Inizio ricarica:', { username: this.username, amount: this.amount });

    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'L\'importo deve essere maggiore di 0';
      return;
    }

    if (!this.username) {
      this.errorMessage = 'Utente non trovato';
      return;
    }

    const amountValue = Math.round(this.amount * 100) / 100;
    if (isNaN(amountValue)) {
      this.errorMessage = 'Importo non valido';
      return;
    }

    console.log('Invio ricarica:', { username: this.username, amount: amountValue });

    this.userService.rechargeBalance(this.username, amountValue).subscribe({
      next: (response) => {
        console.log('Risposta successo:', response);
        this.successMessage = 'Ricarica effettuata con successo';
        this.loadUserData();
        this.amount = 0;
        this.errorMessage = '';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Errore ricarica:', error);
        this.errorMessage = error?.error?.message || 'Errore durante la ricarica';
        this.successMessage = '';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
