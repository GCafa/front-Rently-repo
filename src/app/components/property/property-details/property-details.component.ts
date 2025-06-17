import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyModel } from '../../../models/property-model';
import { ApiPathUtil } from '../../../utils/ApiPathUtil';
import { CommonModule, Location } from '@angular/common';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  standalone: true,
  imports: [
    CommonModule,
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
  userRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private propertyService: PropertyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const propertyId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (!user) {
          this.userRole = null;
          console.warn('Utente non autenticato.');
        } else {
          this.userRole = user.role ? user.role.toUpperCase() : null;
        }

        // Caricamento proprietà dopo aver ottenuto l'utente
        if (propertyId > 0) {
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
      },
      error: () => {
        console.error('Errore nel recupero del ruolo utente.');
        this.userRole = null;
        this.errorMessage = 'Errore durante il recupero dell\'utente';
        this.loading = false;
      }
    });
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

  goToBooking(): void {
    if (this.property) {
      this.router.navigate(['/create-booking'], { state: { property: this.property } });
    }
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
