import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyModel } from '../../../models/property-model';
import { PropertyUpdateRequest } from '../../../dto/request/PropertyUpdateRequest';
import { CustomResponse } from '../../../dto/CustomResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-property',
  templateUrl: './update-property.component.html',
  styleUrls: ['./update-property.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UpdatePropertyComponent implements OnInit {
  updateForm!: FormGroup;
  propertyId!: number;
  property!: PropertyModel;
  selectedImages: File[] = [];
  submitted = false;
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.propertyId = id;
        this.loadProperty();
      } else {
        this.errorMessage = 'ID proprietà non valido';
        this.loading = false;
        this.router.navigate(['/property-list']);
      }
    });
  }

  loadProperty(): void {
    this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: (data: PropertyModel) => {
        this.property = data;
        this.initForm(data);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento della proprietà.';
        this.loading = false;
      }
    });
  }

  initForm(data: PropertyModel): void {
    this.updateForm = this.fb.group({
      title: [data.title, Validators.required],
      description: [data.description, Validators.required],
      pricePerNight: [data.pricePerNight, [Validators.required, Validators.min(0)]],
      bedrooms: [data.bedrooms, [Validators.required, Validators.min(1)]],
      bathrooms: [data.bathrooms, [Validators.required, Validators.min(1)]],
      maxGuests: [data.maxGuests, [Validators.required, Validators.min(1)]],
      isAvailable: [data.isAvailable, Validators.required]
    });
  }

  onImagesSelected(event: any): void {
    if (event.target.files) {
      this.selectedImages = Array.from(event.target.files);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.updateForm.invalid) return;

    const dto = new PropertyUpdateRequest(
      this.updateForm.value.title,
      this.updateForm.value.description,
      this.updateForm.value.pricePerNight,
      this.updateForm.value.bedrooms,
      this.updateForm.value.bathrooms,
      this.updateForm.value.maxGuests,
      this.updateForm.value.isAvailable
    );

    this.loading = true;
    this.propertyService.updateProperty(dto, this.selectedImages).subscribe({
      next: (res: CustomResponse) => {
        this.successMessage = res.message;
        setTimeout(() => this.router.navigate(['/property-list']), 1500);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Errore durante l\'aggiornamento.';
        this.loading = false;
      }
    });
  }

  get f() {
    return this.updateForm.controls;
  }
}
