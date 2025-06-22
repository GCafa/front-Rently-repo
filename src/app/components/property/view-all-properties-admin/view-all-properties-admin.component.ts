import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyModel } from '../../../models/property-model';
import {ApiPathUtil} from '../../../utils/ApiPathUtil';

@Component({
  selector: 'app-view-all-properties-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-all-properties-admin.component.html',
  styleUrls: ['./view-all-properties-admin.component.css']
})
export class ViewAllPropertiesAdminComponent implements OnInit {
  properties: PropertyModel[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  showModal = false;
  selectedPropertyId: number | null = null;
  selectedPropertyTitle = '';

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Errore durante il caricamento degli appartamenti.';
        this.loading = false;
      }
    });
  }

  openDeleteModal(propertyId: number, title: string): void {
    this.selectedPropertyId = propertyId;
    this.selectedPropertyTitle = title;
    this.showModal = true;
  }

  cancelDelete(): void {
    this.showModal = false;
    this.selectedPropertyId = null;
    this.selectedPropertyTitle = '';
  }

  confirmDelete(): void {
    if (!this.selectedPropertyId) return;

    this.propertyService.deleteProperty(this.selectedPropertyId).subscribe({
      next: () => {
        this.successMessage = `Proprietà eliminata con successo.`;
        this.loadProperties();
        this.showModal = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Errore durante l\'eliminazione. Controllare se è prenotata e contattare l\'host.';
        this.showModal = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  protected readonly ApiPathUtil = ApiPathUtil;
}
