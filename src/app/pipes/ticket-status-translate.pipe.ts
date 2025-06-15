import { Pipe, PipeTransform } from '@angular/core';
import { TicketStatus } from '../models/ticket-status';

@Pipe({
  name: 'ticketStatusTranslate',
  standalone: true
})
export class TicketStatusTranslatePipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case TicketStatus.OPEN:
        return 'In attesa';
      case TicketStatus.IN_PROGRESS:
        return 'In corso';
      case TicketStatus.SOLVED:
        return 'Risolto';
      case TicketStatus.CLOSED:
        return 'Chiuso';
      default:
        return status;
    }
  }
}
