import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyModel } from '../models/property-model';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = ApiPathUtil.getPropertiesPath();

  private http = inject(HttpClient);

  createProperty(propertyCreateRequest: PropertyModel, images: File[]): Observable<CustomResponse> {
    const formData = new FormData();
    formData.append('propertyCreateRequestJson', JSON.stringify(propertyCreateRequest));
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    return this.http.post<CustomResponse>(`${this.apiUrl}/create`, formData);
  }

  updateProperty(propertyUpdateRequest: PropertyModel, images?: File[]): Observable<CustomResponse> {
    const formData = new FormData();
    formData.append('propertyUpdateRequestJson', JSON.stringify(propertyUpdateRequest));
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    return this.http.post<CustomResponse>(`${this.apiUrl}/update/${propertyUpdateRequest.propertyId}`, formData);
  }

  deleteProperty(propertyId: number): Observable<CustomResponse> {
    return this.http.delete<CustomResponse>(`${this.apiUrl}/delete/${propertyId}`);
  }

  getPropertyById(propertyId: number): Observable<PropertyModel> {
    return this.http.get<PropertyModel>(`${this.apiUrl}/${propertyId}`);
  }

  getAllProperties(): Observable<PropertyModel[]> {
    return this.http.get<PropertyModel[]>(`${this.apiUrl}`);
  }

  getPropertiesByHostId(hostId: number): Observable<PropertyModel[]> {
    return this.http.get<PropertyModel[]>(`${this.apiUrl}/host/${hostId}`);
  }

  getPropertiesByCity(city: string): Observable<PropertyModel[]> {
    return this.http.get<PropertyModel[]>(`${this.apiUrl}/city/${city}`);
  }

  getAvailableProperties(): Observable<PropertyModel[]> {
    return this.http.get<PropertyModel[]>(`${this.apiUrl}/available`);
  }

  toggleActiveStatus(propertyId: number): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.apiUrl}/toggle-active/${propertyId}`, null);
  }
}
