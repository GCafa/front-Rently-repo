import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { ChatMessageModel} from '../../models/chatMessage-model';
import { ChatMessageRequest} from '../../dto/request/ChatMessageRequest';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user-model';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DatePipe
  ]
})
export class ChatComponent implements OnInit {
  messages: ChatMessageModel[] = [];
  chatForm!: FormGroup;
  receiverId = 0;
  currentUser!: UserModel;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.chatForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the receiver ID from the route parameters
    const id = Number(this.route.snapshot.paramMap.get('receiverId'));
    if (id) {
      this.receiverId = id;
    }

    this.userService.getCurrentUser().subscribe({
      next: user => {
        this.currentUser = user;
        // Load the conversation if we have a receiver ID
        if (this.receiverId) {
          this.loadConversation();
        }
      },
      error: err => {
        console.error('Error getting current user', err);
        this.error = 'Errore nel caricamento dell\'utente';
      }
    });
  }

  loadConversation(): void {
    if (!this.receiverId) return;

    this.loading = true;
    this.chatService.getConversation(this.receiverId).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento dei messaggi', err);
        this.error = 'Errore nel caricamento dei messaggi';
        this.loading = false;
      }
    });
  }

  sendMessage(): void {
    if (this.chatForm.invalid || !this.receiverId) return;

    const content = this.chatForm.get('content')?.value.trim();
    if (!content) return;

    const request = new ChatMessageRequest(content, this.receiverId);
    this.chatService.sendMessage(request).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.chatForm.reset();
      },
      error: (err) => {
        console.error('Errore nell\'invio del messaggio', err);
        this.error = 'Errore nell\'invio del messaggio';
      }
    });
  }

  isMine(msg: ChatMessageModel): boolean {
    return msg.sender?.id === this.currentUser.id;
  }
}
