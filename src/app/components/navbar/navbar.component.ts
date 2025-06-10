import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {Router, RouterLink} from '@angular/router';
import {OverlayPanelModule} from "primeng/overlaypanel";
import {MenuModule} from "primeng/menu";
import {AvatarModule} from "primeng/avatar";
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    imports: [
        RouterLink,
        OverlayPanelModule,
        MenuModule,
        AvatarModule
    ],
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
  isModeratorOrAdmin= this.isModerator || this.isAdmin;


  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    console.log('Navbar ngOnInit');
    this.getUserData();
  }

  getUserData() {
    if (!this.username) {
      if (!this.isAdmin && !this.isModerator) {
        console.log('getUserData chiamato, username:', this.username);
        this.username = this.authService.getUserLoggedUsername();
      }
    }

      if (this.username) {
        // Ottieni i dettagli utente in base allo username
        this.userService.getCurrentUser().subscribe({
          next: (response) => {
            this.userId = response.id;
            this.username = response.username;
            this.userRole = response.role;
            this.userImage = response.imageUrl;

            this.isHost = this.userRole === 'HOST';
            this.isClient = this.userRole === 'CLIENT';
            this.isModerator = this.userRole === 'MODERATOR';
            this.isAdmin = this.userRole === 'ADMIN';

            this.createMenuItems();
          }
        });
      } else {
        console.error();
      }
    }

    createMenuItems()
    {
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
          label: 'Appartamenti preferiti',
          icon: 'fa-solid fa-boxes-stacked',
          visible: this.isClient,
          command: () => this.goToFavoritePropertyList()
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
          label: 'Gestione Ruoli'
          , icon: 'fa-solid fa-user-shield',
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
          label: 'Logout',
          icon: 'fa fa-sign-out-alt',
          visible: true,
          command: () => this.logout()
        }
      ];
    }

    goToProfile()
    {
      this.router.navigate(['/profile']);
    }

    goToModifyUser()
    {
      this.router.navigate(['/modifyUser']);
    }

    goToChangePassword()
    {
      this.router.navigate(['/changePassword']);
    }

    goToRechargeBalance()
    {
      this.router.navigate(['/rechargeBalance']);
    }

    getImageUrl(imageUrl: string | undefined): string
    {
      return this.userService.getImageUrl(imageUrl);
    }

    goToTicket()
    {
      this.router.navigate(['/tickets']);
    }

    goToChangeRoleRequest()
    {
      this.router.navigate(['/changeRoleRequest']);
    }

   goToFavoritePropertyList()
    {
      this.router.navigate(['/propertyList']);
    }

    goToUserVisualization()
    {
      this.router.navigate(['/users-visualization']);
    }

    goTofindAllChangeRoleRequest()
    {
      this.router.navigate(['/findAllChangeRoleRequest']);
    }

   goToCreateProperty()
    {
      this.router.navigate(['/createProperty']);
    }

   logout()
    {
      this.authService.logout();
    }
  }

