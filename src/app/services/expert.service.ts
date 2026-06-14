import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Expert {
  id: string;
  name: string;
  photoUrl?: string;
  yearsExperience: number;
  pricePerHour: number | string;
  subjectExpertise: string[];
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
}

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private apiUrl = 'http://localhost:3000/api/experts';

  constructor(private http: HttpClient) {}

  getExperts(categoryId?: string, search?: string): Observable<Expert[]> {
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Expert[]>(this.apiUrl, { params });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getExpertById(id: string): Observable<Expert> {
    return this.http.get<Expert>(`${this.apiUrl}/${id}`);
  }
}
