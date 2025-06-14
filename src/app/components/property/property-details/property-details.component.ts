import { Component, OnInit, HostListener } from '@angular/core';
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
  currentImageIndex: number = 0;
  showFullscreen: boolean = false;

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
          console.log('Dati ricevuti:', data);
          console.log('Valore available:', data.available);
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

  nextImage(): void {
    if (this.property?.propertyImages?.length) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.property.propertyImages.length;
    }
  }

  prevImage(): void {
    if (this.property?.propertyImages?.length) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.property.propertyImages.length) % this.property.propertyImages.length;
    }
  }

  selectImage(index: number): void {
    if (this.property?.propertyImages && index >= 0 && index < this.property.propertyImages.length) {
      this.currentImageIndex = index;
    }
  }

  goBack(): void {
    this.location.back();
  }

  toggleFullscreen(): void {
    this.showFullscreen = !this.showFullscreen;
  }

  closeFullscreen(): void {
    this.showFullscreen = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.showFullscreen) {
      if (event.key === 'Escape') {
        this.closeFullscreen();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      }
    }
  }
}
