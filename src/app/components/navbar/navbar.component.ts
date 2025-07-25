import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {UserModel} from '../../models/user-model';
import {CommonModule} from '@angular/common';
import {ApiPathUtil} from '../../utils/ApiPathUtil';
import {NotificationsComponent} from '../notifications/notifications.component';

// Definizione dell'interfaccia MenuItem
interface MenuItem {
  label: string;
  icon: string;
  visible: boolean;
  command: () => void;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    CommonModule,
    NotificationsComponent
  ]
})
export class NavbarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  userId: number = 0;
  username: string | null = '';
  userRole: string = '';
  userImage: string | undefined = '';
  isClient: boolean = false;
  isHost: boolean = false;
  isModerator: boolean = false;
  isAdmin: boolean = false;
  isModeratorOrAdmin: boolean = false;
  loading: boolean = false;
  user: UserModel | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Navbar ngOnInit');
    this.getUserData();
  }

  getUserData(): void {
    if (!this.username) {
      if (!this.isAdmin && !this.isModerator) {
        console.log('getUserData chiamato, username:', this.username);
        this.username = this.authService.getUserLoggedUsername();
      }
    }

    if (this.username) {
      this.userService.getCurrentUser().subscribe({
        next: (response) => {
          if (response) {
            this.userId = response.id;
            this.username = response.username;
            this.userRole = response.role;
            this.userImage = response.imageUrl;
            this.user = response;

            this.isHost = this.userRole === 'HOST';
            this.isClient = this.userRole === 'CLIENT';
            this.isModerator = this.userRole === 'MODERATOR';
            this.isAdmin = this.userRole === 'ADMIN';
            this.isModeratorOrAdmin = this.isModerator || this.isAdmin;

            this.createMenuItems();
          }
        },
        error: (error) => {
          console.error('Errore nel recupero dati utente:', error);
        }
      });
    } else {
      console.error('Username non disponibile');
    }
  }

  createMenuItems(): void {
    this.menuItems = [
      {
        label: 'Diventa un Host',
        icon: 'fa fa-store',
        visible: this.isClient,
        command: () => this.goToChangeRoleRequest()
      },
      {
        label: 'Profilo',
        icon: 'fa fa-user',
        visible: this.isClient || this.isHost,
        command: () => this.goToProfile()
      },
      {
        label: 'Modifica Profilo',
        icon: 'fa-solid fa-house',
        visible: this.isClient || this.isHost,
        command: () => this.goToModifyUser()
      },
      {
        label: 'Modifica Password',
        icon: 'fa-solid fa-key',
        visible: this.isClient || this.isHost,
        command: () => this.goToChangePassword()
      },
      {
        label: 'Ricarica Saldo',
        icon: 'fa-solid fa-money-bill',
        visible: this.isClient,
        command: () => this.goToRechargeBalance()
      },

      {
        label: 'Prenota',
        icon: 'fa-solid fa-calendar-check',
        visible: this.isClient,
        command: () => this.goToViewAllProperties()
      },
      {
        label: 'Ticket',
        icon: 'fa-solid fa-ticket',
        visible: this.isModerator,
        command: () => this.goToTicket()
      },
      {
        label: 'Gestione utenti',
        icon: 'fa-solid fa-users',
        visible: this.isModeratorOrAdmin,
        command: () => this.goToUserVisualization()
      },
      {
        label: 'Gestione Ruoli',
        icon: 'fa-solid fa-user-shield',
        visible: this.isAdmin,
        command: () => this.goTofindAllChangeRoleRequest()
      },
      {
        label: 'Crea Appartamento',
        icon: 'fa-solid fa-gavel',
        visible: this.isHost,
        command: () => this.goToCreateProperty()
      },
      {
        label: 'Le tue Prenotazioni',
        icon: 'fa-solid fa-gavel',
        visible: this.isClient,
        command: () => this.goToMyBookings()
      },
      {
        label: 'Gestione Prenotazioni',
        icon: 'fa-solid fa-gavel',
        visible: this.isAdmin,
        command: () => this.goToAdminBookingList()
      },
      {
        label: 'Pagamenti',
        icon: 'bi bi-cash-coin',
        visible: this.isHost,
        command: () => this.goToHostDashboard()
      },
      {
        label: 'Preferiti',
        icon: 'bi bi-heart-fill me-1',
        visible: this.isClient,
        command: () => this.goToFavoritePropertyList()
      },
      {
        label: 'Visualizza Appartamenti',
        icon: 'fa fa-eye',
        visible: this.isModeratorOrAdmin,
        command: () => this.goToViewAllPropertiesAdmin()
      },
      {
        label: 'Calendario Host',
        icon: 'fa fa-calendar',
        visible: this.isHost,
        command: () => this.goToHostCalendar()
      },
      {
        label: 'Chat con i clienti',
        icon: 'fa fa-comments',
        visible: this.isHost,
        command: () => this.goToHostChats()
      },
      {
        label: 'Logout',
        icon: 'fa fa-sign-out-alt',
        visible: true,
        command: () => this.logout()
      }
    ];
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToModifyUser(): void {
    this.router.navigate(['/modify']);
  }

  goToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  goToRechargeBalance(): void {
    this.router.navigate(['/recharge-balance']);
  }

  goToViewAllProperties(): void {
    this.router.navigate(['/properties']);
  }

  goToTicket(): void {
    this.router.navigate(['/moderator-tickets']);
  }

  goToChangeRoleRequest(): void {
    this.router.navigate(['/change-role-request']);
  }

  goToFavoritePropertyList(): void {
    this.router.navigate(['/favorite-properties']);
  }

  goToUserVisualization(): void {
    this.router.navigate(['/users-visualization']);
  }

  goTofindAllChangeRoleRequest(): void {
    this.router.navigate(['/find-all-change-role-request']);
  }

  goToCreateProperty(): void {
    this.router.navigate(['/create-property']);
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  goToAdminBookingList(): void {
    this.router.navigate(['/admin-bookings']);
  }

  goToHostDashboard(): void {
    this.router.navigate(['/host-dashboard']);
  }

  goToViewAllPropertiesAdmin(): void {
    this.router.navigate(['/view-all-properties-admin']);
  }

  goToHostCalendar(): void {
    this.router.navigate(['/host-calendar']);
  }

  goToHostChats(): void {
    this.router.navigate(['/host-chats']);
  }

  logout(): void {
    this.authService.logout();
  }

  onImageError() {
    this.userImage = 'assets/images/defaultProfileImage.png'; // Assicurati di avere un'immagine di default
    console.error('Errore nel caricamento dell\'immagine del profilo');
  }

  protected readonly ApiPathUtil = ApiPathUtil;
}
