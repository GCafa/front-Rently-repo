import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyModel } from '../../../models/property-model';
import { ApiPathUtil } from '../../../utils/ApiPathUtil';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, Location, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    NgOptimizedImage
  ],
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  property: PropertyModel | null = null;
  errorMessage: string = '';
  loading: boolean = true;
  imageBaseUrl = ApiPathUtil.getImageBaseUrl();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    const propertyId = Number(this.route.snapshot.paramMap.get('id'));
    if (propertyId) {
      this.propertyService.getPropertyById(propertyId).subscribe({
        next: (data) => {
          this.property = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Errore caricamento proprietà:', error);
          this.errorMessage = 'Errore nel caricamento dei dettagli della proprietà';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'ID proprietà non valido';
      this.loading = false;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
