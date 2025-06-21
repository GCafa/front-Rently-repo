import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewModel } from '../../../models/review-model';
import { CommonModule } from '@angular/common';
import { CustomResponse } from '../../../dto/CustomResponse';

@Component({
  selector: 'app-host-review',
  templateUrl: './host-review.component.html',
  styleUrls: ['./host-review.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class HostReviewComponent implements OnInit {
  reviewId!: number;
  review!: ReviewModel;
  form!: FormGroup;
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.reviewId = Number(this.route.snapshot.paramMap.get('reviewId'));
    this.form = this.fb.group({
      response: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]]
    });

    this.reviewService.getReviewById(this.reviewId).subscribe({
      next: (res) => {
        this.review = res;
        this.loading = false;
        if (this.review.hostResponse) {
          this.form.disable();
          this.errorMessage = 'Hai già risposto a questa recensione.';
        }
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento della recensione.';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.reviewService.addHostResponse(this.reviewId, this.form.value).subscribe({
      next: (res: CustomResponse) => {
        this.successMessage = res.message;
        this.form.disable();

        // Redireziona dopo 1.5s
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Errore durante l\'invio della risposta.';
      }
    });
  }
}
