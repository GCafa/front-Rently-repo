import { Component, OnInit } from '@angular/core';
import { TicketModel} from '../../../models/ticket-model';
import { TicketService} from '../../../services/ticket.service';
import {Router, RouterLink} from '@angular/router';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TicketSummaryWidgetComponent} from '../ticket-summary-widget/ticket-summary-widget.component';
import {TicketStatus} from '../../../models/ticket-status';
import {TicketStatusTranslatePipe} from '../../../pipes/ticket-status-translate.pipe';

@Component({
  selector: 'app-moderator-ticket-list',
  templateUrl: './moderator-ticket-list.component.html',
  imports: [
    DatePipe,
    TicketSummaryWidgetComponent,
    NgForOf,
    NgIf,
    NgClass,
    TicketStatusTranslatePipe
  ],
  styleUrls: ['./moderator-ticket-list.component.css']
})
export class ModeratorTicketListComponent implements OnInit {
  tickets: TicketModel[] = [];
  loading = false;
  error = '';
  currentStatus: string | null = null;
  TicketStatus = TicketStatus;

  constructor(protected ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(status: string | null = null): void {
    this.loading = true;
    this.currentStatus = status;

    this.ticketService.getAllTickets(status || undefined).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento dei ticket';
        this.loading = false;
      }
    });
  }

  onFilterByStatus(status: string | null): void {
    this.loadTickets(status);
  }

  acceptTicket(id: number): void {
    this.ticketService.assignTicket(id).subscribe({
      next: () => this.router.navigate(['/ticket', id]),
      error: () => alert('Errore durante l\'assegnazione del ticket')
    });
  }

  viewTicket(id: number): void {
    this.router.navigate(['/ticket', id]);
  }

  solveTicket(id: number): void {
    this.ticketService.solveTicket(id).subscribe({
      next: () => this.loadTickets(this.currentStatus),
      error: () => alert('Errore nel segnare il ticket come risolto.')
    });
  }

  closeTicket(id: number): void {
    this.ticketService.closeTicket(id).subscribe({
      next: () => this.loadTickets(this.currentStatus),
      error: () => alert('Errore nella chiusura del ticket.')
    });
  }


}
