import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyModel } from '../../../models/property-model';
import { ApiPathUtil } from '../../../utils/ApiPathUtil';
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../models/user-model';
import { ReviewModel } from '../../../models/review-model';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  property: PropertyModel | null = null;
  reviews: ReviewModel[] = [];
  errorMessage: string = '';
  loading: boolean = true;
  imageBaseUrl = ApiPathUtil.getImageBaseUrl();
  currentImageIndex: number = 0;
  showFullscreen: boolean = false;
  userRole: string | null = null;
  currentUser: UserModel | null = null;

  showFavoriteSuccess: boolean = false; // ✅ MESSAGGIO SUCCESSO

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private propertyService: PropertyService,
    private userService: UserService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const propertyId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userRole = user?.role?.toUpperCase() || null;
        this.currentUser = user;

        if (propertyId > 0) {
          this.propertyService.getPropertyById(propertyId).subscribe({
            next: (data) => {
              this.property = data;
              this.loading = false;
              this.loadReviews(propertyId);  // Carica recensioni dopo la proprietà
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

  loadReviews(propertyId: number): void {
    this.reviewService.getReviewsByPropertyId(propertyId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: () => {
        console.error('Errore nel caricamento delle recensioni');
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

  addToFavorites(): void {
    if (!this.currentUser || !this.property) {
      this.errorMessage = 'Errore: utente o proprietà non disponibili.';
      return;
    }

    this.userService.addFavoriteProperty(this.currentUser.username, this.property.id).subscribe({
      next: () => {
        this.errorMessage = '';
        this.showFavoriteSuccess = true;

        // ✅ Nascondi il messaggio dopo 3 secondi
        setTimeout(() => {
          this.showFavoriteSuccess = false;
        }, 3000);
      },
      error: () => {
        this.errorMessage = 'Errore durante l\'aggiunta ai preferiti.';
      }
    });
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
