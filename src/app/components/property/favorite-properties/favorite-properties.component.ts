import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { PropertyModel } from '../../../models/property-model';
import { UserModel } from '../../../models/user-model';
import { RouterLink } from '@angular/router';
import { ApiPathUtil } from '../../../utils/ApiPathUtil';

@Component({
  selector: 'app-favorite-properties',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorite-properties.component.html',
  styleUrls: ['./favorite-properties.component.css']
})
export class FavoritePropertiesComponent implements OnInit {
  currentUser: UserModel | null = null;
  favoriteProperties: PropertyModel[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  imageBaseUrl = ApiPathUtil.getImageBaseUrl();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user?.username) {
          this.userService.getAllFavoriteProperties(user.username).subscribe({
            next: (properties) => {
              this.favoriteProperties = properties;
              this.loading = false;
            },
            error: () => {
              this.errorMessage = 'Errore nel caricamento delle proprietà preferite.';
              this.loading = false;
            }
          });
        }
      },
      error: () => {
        this.errorMessage = 'Errore nel recupero dell’utente.';
        this.loading = false;
      }
    });
  }

  removeFromFavorites(propertyId: number): void {
    if (!this.currentUser?.username) return;

    this.userService.removeFavoriteProperty(this.currentUser.username, propertyId).subscribe({
      next: () => {
        this.favoriteProperties = this.favoriteProperties.filter(p => p.id !== propertyId);
      },
      error: () => {
        this.errorMessage = 'Errore durante la rimozione della proprietà dai preferiti.';
      }
    });
  }
}
