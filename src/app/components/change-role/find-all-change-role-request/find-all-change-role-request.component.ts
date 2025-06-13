import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeRoleResponse } from '../../../dto/ChangeRoleResponse';
import { ChangeRoleService } from '../../../services/changeRole.service';

@Component({
  selector: 'app-find-all-change-role-request',
  templateUrl: './find-all-change-role-request.component.html',
  styleUrls: ['./find-all-change-role-request.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class FindAllChangeRoleRequestComponent implements OnInit {
  changeRoleRequests: ChangeRoleResponse[] = [];
  loading = false;
  showRejectionForm = false;
  rejectionMotivation = '';
  errorMessage = '';
  selectedRequestId: number | null = null;

  constructor(private changeRoleService: ChangeRoleService) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.loading = true;
    this.errorMessage = '';

    this.changeRoleService.findAllChangeRoleRequests().subscribe({
      next: (requests) => {
        this.changeRoleRequests = requests
          .filter(r => r.status === 'PENDING')
          .map(request => ({ ...request }));
        for(let sos of this.changeRoleRequests) {
          console.log(sos);
        }
        this.loading = false;
      },
      error: (error) => {
        this.handleError(`Errore nel caricamento delle richieste: ${error.message || 'Errore sconosciuto'}`);
        this.loading = false;
      }
    });
  }

  get pendingRequests(): ChangeRoleResponse[] {
    return this.changeRoleRequests;
  }

  acceptChangeRole(id: number): void {
    if (!id || isNaN(id)) {
      console.log(this.changeRoleRequests );
      this.handleError('ID richiesta non valido o mancante');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.changeRoleService.acceptChangeRole(id).subscribe({
      next: () => {
        this.showSuccess('Richiesta accettata con successo');
        this.fetchRequests();
      },
      error: (error) => {
        this.handleError(`Errore durante l'accettazione: ${error.message || 'Errore sconosciuto'}`);
        this.loading = false;
      }
    });
  }

  showRejectionDialog(id: number): void {
    this.selectedRequestId = id;
    this.rejectionMotivation = '';
    this.errorMessage = '';
    this.showRejectionForm = true;
  }

  rejectChangeRole(): void {
    if (!this.selectedRequestId) {
      this.handleError('ID richiesta mancante');
      return;
    }

    if (!this.rejectionMotivation || this.rejectionMotivation.trim() === '') {
      this.errorMessage = 'La motivazione è obbligatoria';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.changeRoleService.rejectChangeRole(this.selectedRequestId, this.rejectionMotivation).subscribe({
      next: () => {
        this.showSuccess('Richiesta rifiutata con successo');
        this.cancelRejection();
        this.fetchRequests();
      },
      error: (error) => {
        this.handleError(`Errore durante il rifiuto: ${error.message || 'Errore sconosciuto'}`);
        this.loading = false;
      }
    });
  }

  cancelRejection(): void {
    this.selectedRequestId = null;
    this.rejectionMotivation = '';
    this.showRejectionForm = false;
    this.errorMessage = '';
  }

  private showSuccess(message: string): void {
    console.log('✅', message);
  }

  private handleError(error: string): void {
    this.errorMessage = error;
    console.error('❌', error);
  }
}
