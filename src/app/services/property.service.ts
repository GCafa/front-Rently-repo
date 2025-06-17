import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyModel } from '../models/property-model';
import { CustomResponse } from '../dto/CustomResponse';
import { ApiPathUtil } from '../utils/ApiPathUtil';
import {PropertyCreateRequest} from '../dto/request/PropertyCreateRequest';
import {PropertyUpdateRequest} from '../dto/request/PropertyUpdateRequest';
import {AvailablePropertyRequest} from '../dto/request/AvailablePropertyRequest';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = ApiPathUtil.getPropertiesPath();

  private http = inject(HttpClient);

  createProperty(propertyCreateRequest: PropertyCreateRequest, images: File[]): Observable<CustomResponse> {
    const formData = new FormData();
    formData.append('propertyCreateRequestJson', JSON.stringify(propertyCreateRequest));
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    return this.http.post<CustomResponse>(`${this.apiUrl}/create`, formData);
  }

  updateProperty(propertyUpdateRequest: PropertyUpdateRequest, images?: File[]): Observable<CustomResponse> {
    const formData = new FormData();
    formData.append('propertyUpdateRequestJson', JSON.stringify(propertyUpdateRequest));
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    return this.http.post<CustomResponse>(`${this.apiUrl}/update/${propertyUpdateRequest}`, formData);
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

  searchAvailableProperties(availablePropertiesRequest: AvailablePropertyRequest): Observable<PropertyModel[]> {
    return this.http.post<PropertyModel[]>(`${this.apiUrl}/search/available`, availablePropertiesRequest);
  }
}
