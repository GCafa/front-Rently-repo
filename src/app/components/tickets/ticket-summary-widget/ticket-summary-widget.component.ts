import { Component, OnInit } from '@angular/core';
import { TicketService} from '../../../services/ticket.service';
import { TicketModel} from '../../../models/ticket-model';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-summary-widget',
  templateUrl: './ticket-summary-widget.component.html',
  standalone: true,
  imports: [
    NgIf,
    CommonModule
  ],
  styleUrls: ['./ticket-summary-widget.component.css']
})
export class TicketSummaryWidgetComponent implements OnInit {
  total = 0;
  pending = 0;
  inProgress = 0;
  resolved = 0;
  closed = 0;
  loading = true;
  error = false;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (tickets: TicketModel[]) => {
        console.log('Tickets ricevuti:', tickets);
        this.total = tickets.length;
        this.pending = tickets.filter(t => t.status === 'OPEN').length;
        this.inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
        this.resolved = tickets.filter(t => t.status === 'RESOLVED').length;
        this.closed = tickets.filter(t => t.status === 'CLOSED').length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore durante il caricamento del riepilogo', err);
        this.loading = false;
        this.error = true;
      }
    });
  }
}
