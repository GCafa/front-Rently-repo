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
    // opzionale: carica tutte le proprietà inizialmente o lascia vuoto
    // this.loadAll();
  }

  searchAvailable(): void {
    if (!this.checkInDate || !this.checkOutDate || !this.city) {
      this.errorMessage = 'Tutti i campi sono obbligatori.';
      return;
    }

    const request = new AvailablePropertyRequest(
      new Date(this.checkInDate),
      new Date(this.checkOutDate),
      this.city,
      this.numOfAdults,
      this.numOfChildren
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
