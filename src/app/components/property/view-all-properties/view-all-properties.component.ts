import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyModel } from '../../../models/property-model';
import { PropertyService } from '../../../services/property.service';
import { ApiPathUtil } from '../../../utils/ApiPathUtil';
import { AvailablePropertyRequest } from '../../../dto/request/AvailablePropertyRequest';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-all-properties',
  templateUrl: './view-all-properties.component.html',
  styleUrls: ['./view-all-properties.component.css'],
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule]
})
export class ViewAllPropertiesComponent implements OnInit {
  properties: PropertyModel[] = [];
  errorMessage: string = '';

  // Campi per il filtro
  checkInDate: string = '';
  checkOutDate: string = '';
  city: string = '';
  numOfAdults: number = 1;
  numOfChildren: number = 0;

  constructor(
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carica tutte le proprietà inizialmente
    this.loadAll();
  }

  loadAll(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento delle proprietà.';
      }
    });
  }

  searchAvailable(): void {
    // Se non è stato inserito alcun criterio di ricerca, mostra tutte le proprietà
    if (!this.checkInDate && !this.checkOutDate && !this.city && this.numOfAdults === 1 && this.numOfChildren === 0) {
      this.loadAll();
      return;
    }

    // Imposta valori predefiniti per i campi non compilati
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const checkIn = this.checkInDate ? new Date(this.checkInDate) : tomorrow;
    const checkOut = this.checkOutDate ? new Date(this.checkOutDate) : dayAfterTomorrow;
    const city = this.city || '';
    const adults = this.numOfAdults || 1;
    const children = this.numOfChildren || 0;

    const request = new AvailablePropertyRequest(
      checkIn,
      checkOut,
      city,
      adults,
      children
    );

    this.propertyService.searchAvailableProperties(request).subscribe({
      next: (data) => {
        this.properties = data;
        this.errorMessage = '';

      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento delle proprietà disponibili.';
      }
    });
  }

  getImageUrl(property: PropertyModel): string {
    if (property.propertyImages && property.propertyImages.length > 0) {
      return ApiPathUtil.getImageBaseUrl() + property.propertyImages[0];
    }
    return 'assets/img/no-image.jpg';
  }

  goToDetails(propertyId: number): void {
    this.router.navigate(['/property-details', propertyId]);
  }
}
