import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const items = this.el.nativeElement.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((item: Element) => observer.observe(item));
  }
}
