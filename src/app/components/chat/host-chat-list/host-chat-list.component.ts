import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../models/user-model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-host-chat-list',
  templateUrl: './host-chat-list.component.html',
  styleUrls: ['./host-chat-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe
  ]
})
export class HostChatListComponent implements OnInit {
  conversations: any[] = [];
  currentUser!: UserModel;
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: user => {
        this.currentUser = user;

        if (this.currentUser.role === 'HOST') {
          this.loadAllHostConversations();
        } else {
          // Redirect non-host users to home
          this.router.navigate(['/home']);
        }
      },
      error: err => {
        console.error('Error getting current user', err);
        this.error = 'Errore nel caricamento dell\'utente';
      }
    });
  }

  loadAllHostConversations(): void {
    this.loading = true;
    this.chatService.getAllHostConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento delle conversazioni', err);
        this.error = 'Errore nel caricamento delle conversazioni';
        this.loading = false;
      }
    });
  }

  navigateToChat(userId: number): void {
    this.router.navigate(['/chat', userId]);
  }
}
