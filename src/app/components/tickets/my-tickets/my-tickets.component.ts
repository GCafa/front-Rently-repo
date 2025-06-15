import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { TicketModel } from '../../../models/ticket-model';
import {Router, RouterLink} from '@angular/router';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {TicketStatus} from '../../../models/ticket-status';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css'],
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass,
    RouterLink
  ]
})
export class MyTicketsComponent implements OnInit {
  myTickets: TicketModel[] = [];
  loading = false;
  error = '';

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getMyTickets().subscribe({
      next: (tickets) => {
        this.myTickets = tickets;
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore durante il caricamento dei ticket';
        this.loading = false;
      }
    });
  }

  viewTicket(id: number): void {
    console.log(id);
    this.router.navigate(['/ticket', id]);
  }

  protected readonly TicketStatus = TicketStatus;
}
