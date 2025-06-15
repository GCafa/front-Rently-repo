import { Component, OnInit } from '@angular/core';
import { TicketModel} from '../../../models/ticket-model';
import { TicketService} from '../../../services/ticket.service';
import {Router, RouterLink} from '@angular/router';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TicketSummaryWidgetComponent} from '../ticket-summary-widget/ticket-summary-widget.component';

@Component({
  selector: 'app-moderator-ticket-list',
  templateUrl: './moderator-ticket-list.component.html',
  imports: [
    DatePipe,
    TicketSummaryWidgetComponent,
    NgForOf,
    NgIf,
    NgClass,
    RouterLink
  ],
  styleUrls: ['./moderator-ticket-list.component.css']
})
export class ModeratorTicketListComponent implements OnInit {
  tickets: TicketModel[] = [];
  loading = false;
  error = '';

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento dei ticket aperti';
        this.loading = false;
      }
    });
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
}
