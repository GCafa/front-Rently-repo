import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyModel } from '../../models/property-model';
import { PropertyService } from '../../services/property.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  imports: [CommonModule, NavbarComponent],
})
export class PropertyListComponent implements OnInit {
  properties: PropertyModel[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private propertyService: PropertyService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (!user) {
          this.errorMessage = 'Utente non autenticato.';
          return;
        }

        const hostId = user.id;
        this.propertyService.getPropertiesByHostId(hostId).subscribe({
          next: (props) => {
            this.properties = props;
          },
          error: () => {
            this.errorMessage = 'Errore durante il caricamento delle proprietà.';
            console.log(hostId);
          },
        });
      },
      error: () => {
        this.errorMessage = 'Errore nel recupero dell\'utente.';
      }
    });
  }

  viewDetails(propertyId: number): void {
    this.router.navigate(['/property', propertyId]);
  }

  toggleStatus(propertyId: number): void {
    this.propertyService.toggleActiveStatus(propertyId).subscribe({
      next: () => {
        const property = this.properties.find(p => p.propertyId === propertyId);
        if (property) {
          property.isAvailable = !property.isAvailable;
        }
        this.successMessage = 'Stato aggiornato con successo.';
      },
      error: () => {
        this.errorMessage = 'Errore durante il cambio di stato.';
      }
    });
  }

  deleteProperty(propertyId: number): void {
    this.propertyService.deleteProperty(propertyId).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p.propertyId !== propertyId);
        this.successMessage = 'Proprietà eliminata con successo.';
      },
      error: () => {
        this.errorMessage = 'Errore durante l\'eliminazione.';
      }
    });
  }
}
