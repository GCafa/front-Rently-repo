import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common'; // ✅ Import Location

import { ReviewService } from '../../../services/review.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-client-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-review.component.html',
  styleUrls: ['./client-review.component.css']
})
export class ClientReviewComponent implements OnInit {
  title: string = '';
  description: string = '';
  rating: number = 5;

  reviewerId!: number;
  propertyId!: number;
  message: string = '';
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private userService: UserService,
    private location: Location // ✅ Aggiunto qui
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const propertyIdParam = this.route.snapshot.queryParamMap.get('propertyId');
    if (!propertyIdParam) {
      this.message = 'Errore: propertyId mancante nei parametri.';
      return;
    }

    this.propertyId = Number(propertyIdParam);

    this.userService.getCurrentUser().subscribe({
      next: (user) => this.reviewerId = user.id,
      error: () => this.message = 'Errore nel recupero dell’utente loggato.'
    });
  }

  submitReview(): void {
    if (!this.propertyId || !this.reviewerId) {
      this.message = 'Errore: dati mancanti.';
      return;
    }

    if (!this.title.trim() || !this.description.trim()) {
      this.message = 'Compila tutti i campi obbligatori.';
      return;
    }

    const reviewRequest = {
      title: this.title,
      description: this.description,
      rating: this.rating,
      reviewerId: this.reviewerId
    };

    this.isSubmitting = true;

    this.reviewService.createPropertyReview(this.propertyId, reviewRequest).subscribe({
      next: () => {
        this.message = 'Recensione inviata con successo!';
        this.title = '';
        this.description = '';
        this.rating = 5;
        this.isSubmitting = false;
      },
      error: () => {
        this.message = 'Errore durante l’invio. Hai già soggiornato qui?';
        this.isSubmitting = false;
      }
    });
  }
}
