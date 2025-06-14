import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../services/property.service';
import { Router } from '@angular/router';
import { PropertyCreateRequest } from '../../dto/request/PropertyCreateRequest';
import { Country, State, City } from 'country-state-city';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-property',
  standalone: true,
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreatePropertyComponent {
  propertyForm: FormGroup;
  selectedImages: File[] = [];

  countries = Country.getAllCountries();
  states: any[] = [];
  cities: any[] = [];

  selectedCountryCode: string = '';
  selectedStateCode: string = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private router: Router
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      pricePerNight: [0, [Validators.required, Validators.min(0)]],
      maxGuests: [1, [Validators.required, Validators.min(0)]],
      bedrooms: [1, [Validators.required, Validators.min(0)]],
      bathrooms: [1, [Validators.required, Validators.min(0)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  onCountryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const code = target.value;
    this.selectedCountryCode = code;
    this.states = State.getStatesOfCountry(code);
    this.propertyForm.patchValue({ state: '', city: '' });
    this.cities = [];
  }

  onStateChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const code = target.value;
    this.selectedStateCode = code;
    this.cities = City.getCitiesOfState(this.selectedCountryCode, code);
    this.propertyForm.patchValue({ city: '' });
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.selectedImages = Array.from(files);
    }
  }

  onSubmit(): void {
    if (this.propertyForm.invalid) {
      this.errorMessage = 'Compila tutti i campi obbligatori';
      return;
    }

    const propertyRequest: PropertyCreateRequest = this.propertyForm.value;

    this.propertyService.createProperty(propertyRequest, this.selectedImages).subscribe({
      next: () => {
        this.successMessage = 'Appartamento creato con successo!';
      },
      error: () => {
        this.errorMessage = 'Errore durante la creazione dell\'appartamento';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['profile']);
  }
}
