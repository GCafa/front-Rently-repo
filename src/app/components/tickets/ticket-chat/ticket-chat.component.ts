import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { TicketDetailResponse } from '../../../dto/TicketDetailResponse';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-ticket-chat',
  standalone: true,
  templateUrl: './ticket-chat.component.html',
  styleUrls: ['./ticket-chat.component.css'],
  imports: [
    FormsModule,
    NgClass,
    DatePipe,
    NgIf,
    NgForOf,
    RouterModule
  ]
})
export class TicketChatComponent implements OnInit {
  ticketId!: number;
  ticket!: TicketDetailResponse;
  newMessage: string = '';
  error = '';
  loading = false;
  sending = false;

  constructor(private route: ActivatedRoute, private ticketService: TicketService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ticketId = Number(id);
      this.loadTicket();
    } else {
      this.error = 'ID ticket non valido';
    }
  }

  loadTicket(): void {
    this.loading = true;
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (res) => {
        this.ticket = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore durante il caricamento del ticket';
        this.loading = false;
      }
    });
  }

  sendReply(): void {
    if (!this.newMessage.trim()) return;
    this.sending = true;

    const reply = {
      content: this.newMessage,
      fromModerator: this.ticket.user.role !== 'CLIENT' // o === 'MODERATOR' se preferisci
    };

    this.ticketService.addReply(this.ticketId, reply).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadTicket();
        this.sending = false;
      },
      error: () => {
        this.error = 'Errore durante l\'invio della risposta';
        this.sending = false;
      }
    });
  }
}
