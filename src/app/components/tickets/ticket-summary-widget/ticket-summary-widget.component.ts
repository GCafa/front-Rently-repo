import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TicketService} from '../../../services/ticket.service';
import { TicketModel} from '../../../models/ticket-model';
import { NgIf, CommonModule } from '@angular/common';
import {TicketStatus} from '../../../models/ticket-status';

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
  solved = 0;
  closed = 0;
  loading = true;
  error = false;

  // Add an event emitter for status filter
  @Output() filterByStatus = new EventEmitter<string | null>();

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
        this.pending = tickets.filter(t => t.status === TicketStatus.OPEN).length;
        this.inProgress = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
        this.solved = tickets.filter(t => t.status === TicketStatus.SOLVED).length;
        this.closed = tickets.filter(t => t.status === TicketStatus.CLOSED).length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore durante il caricamento del riepilogo', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  // Add methods to handle clicks on status widgets
  onTotalClick(): void {
    this.filterByStatus.emit(null); // null means show all tickets
  }

  onPendingClick(): void {
    this.filterByStatus.emit(TicketStatus.OPEN);
  }

  onInProgressClick(): void {
    this.filterByStatus.emit(TicketStatus.IN_PROGRESS);
  }

  onSolvedClick(): void {
    this.filterByStatus.emit(TicketStatus.SOLVED);
  }

  onClosedClick(): void {
    this.filterByStatus.emit(TicketStatus.CLOSED);
  }
}
