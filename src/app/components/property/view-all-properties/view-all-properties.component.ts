import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyModel } from '../../../models/property-model';
import { PropertyService } from '../../../services/property.service';
import { ApiPathUtil } from '../../../utils/ApiPathUtil';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-view-all-properties',
  templateUrl: './view-all-properties.component.html',
  styleUrls: ['./view-all-properties.component.css'],
  imports: [
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class ViewAllPropertiesComponent implements OnInit {
  properties: PropertyModel[] = [];
  errorMessage: string = '';

  constructor(
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (data) => this.properties = data,
      error: () => this.errorMessage = 'Errore nel caricamento delle proprietà.'
    });
  }

  getImageUrl(property: PropertyModel): string {
    if (property.propertyImages && property.propertyImages.length > 0) {
      return ApiPathUtil.getImageBaseUrl() + property.propertyImages[0];
    }
    return 'assets/img/no-image.jpg'; // fallback
  }

  goToDetails(propertyId: number): void {
    this.router.navigate(['/property-details', propertyId]);
  }
}
