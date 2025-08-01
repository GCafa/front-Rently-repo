import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { PropertyModel } from '../../models/property-model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Typewriter from "typewriter-effect/dist/core";
import { AuthService } from '../../services/auth.service';

const CAROUSEL_RESPONSIVE_OPTIONS = [
  { breakpoint: '1199px', numVisible: 1, numScroll: 1 },
  { breakpoint: '991px', numVisible: 2, numScroll: 1 },
  { breakpoint: '767px', numVisible: 1, numScroll: 1 },
];

const TYPEWRITER_TEXTS = [
  'Find your perfect home away from home!',
  'Discover amazing properties for your next trip',
  'Book your dream vacation rental today!',
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class HomeComponent implements OnInit {
  featuredProperties: PropertyModel[] = [];
  isLoading = true;
  errorMessage = '';
  isAuthenticated = false;

  private typewriterElement!: ElementRef;
  private typewriterInitialized = false;

  @ViewChild('typewriterElement') set _typewriterElement(el: ElementRef) {
    if (el && !this.typewriterInitialized) {
      this.typewriterElement = el;
      this.initializeTypewriter();
      this.typewriterInitialized = true;
    }
  }

  private initializeTypewriter(): void {
    new Typewriter(this.typewriterElement.nativeElement, {
      strings: TYPEWRITER_TEXTS,
      autoStart: true,
      loop: true,
      delay: 75,
    });
  }

  constructor(
    private propertyService: PropertyService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}
