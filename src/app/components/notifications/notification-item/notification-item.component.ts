import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationModel } from '../../../models/notification-model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-item" [ngClass]="{'unread': !notification.read}">
      <div class="notification-content">
        <div class="notification-type" [ngClass]="notification.type.toLowerCase()">
          <i class="fa" [ngClass]="getIconClass()"></i>
        </div>
        <div class="notification-message">
          <p>{{ notification.message }}</p>
          <span class="notification-time">{{ notification.createdAt | date:'short' }}</span>
        </div>
      </div>
      <div class="notification-actions">
        @if (!notification.read) {
          <button class="read-btn" (click)="markAsRead()" title="Segna come letta">
            <i class="fa fa-check"></i>
          </button>
        }
        <button class="delete-btn" (click)="deleteNotification()" title="Elimina">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-item {
      display: flex;
      padding: 16px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
    }

    .notification-item:hover {
      background-color: rgba(0,0,0,0.02);
    }

    .notification-item.unread {
      background-color: rgba(33, 150, 243, 0.08);
      border-left: 4px solid #2196F3;
    }

    .notification-content {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .notification-type {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 16px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      color: white;
      font-size: 1.2rem;
    }

    .notification-type.info {
      background: linear-gradient(135deg, #2196F3, #0D47A1);
    }

    .notification-type.success {
      background: linear-gradient(135deg, #4CAF50, #1B5E20);
    }

    .notification-type.warning {
      background: linear-gradient(135deg, #FFC107, #FF6F00);
    }

    .notification-type.error {
      background: linear-gradient(135deg, #F44336, #B71C1C);
    }

    .notification-type.system {
      background: linear-gradient(135deg, #9C27B0, #4A148C);
    }

    .notification-message {
      flex: 1;
    }

    .notification-message p {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 5px;
      line-height: 1.4;
    }

    .notification-time {
      font-size: 12px;
      color: #757575;
      font-style: italic;
    }

    .notification-actions {
      display: flex;
      align-items: center;
    }

    .notification-actions button {
      background: none;
      border: none;
      cursor: pointer;
      margin-left: 12px;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.2s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
    }

    .notification-actions button:hover {
      background-color: rgba(0,0,0,0.05);
    }

    .read-btn {
      color: #4caf50;
    }

    .read-btn:hover {
      background-color: rgba(76, 175, 80, 0.1) !important;
    }

    .delete-btn {
      color: #f44336;
    }

    .delete-btn:hover {
      background-color: rgba(244, 67, 54, 0.1) !important;
    }
  `]
})
export class NotificationItemComponent {
  @Input() notification!: NotificationModel;
  @Output() updated = new EventEmitter<void>();

  constructor(private notificationService: NotificationService) {}

  getIconClass(): string {
    switch(this.notification.type.toLowerCase()) {
      case 'success': return 'fa-check-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'error': return 'fa-times-circle';
      case 'system': return 'fa-cog';
      case 'info':
      default: return 'fa-info-circle';
    }
  }

  markAsRead(): void {
    this.notificationService.markAsRead(this.notification.id).subscribe({
      next: () => {
        this.notification.read = true;
        this.updated.emit();
      },
      error: (err) => {
        console.error('Errore durante la marcatura come letta:', err);
      }
    });
  }

  deleteNotification(): void {
    this.notificationService.deleteNotification(this.notification.id).subscribe({
      next: () => {
        this.updated.emit();
      },
      error: (err) => {
        console.error('Errore durante l\'eliminazione della notifica:', err);
      }
    });
  }
}
