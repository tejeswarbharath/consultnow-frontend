import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Expert {
  id: string;
  name: string;
  email?: string;
  photoUrl?: string;
  yearsExperience: number;
  pricePerHour: number | string;
  subjectExpertise: string;
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
  bio?: string;
  marketingSnippet?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private apiUrl = 'http://localhost:3000/api/experts';
  private expertUpdatedSource = new Subject<Expert>();
  expertUpdated$ = this.expertUpdatedSource.asObservable();

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

  getExpertsGroupedBySubject(): Observable<{[key: string]: Expert[]}> {
    let params = new HttpParams().set('groupBy', 'subjectExpertise');
    return this.http.get<{[key: string]: Expert[]}>(this.apiUrl, { params });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getExpertById(id: string): Observable<Expert> {
    return this.http.get<Expert>(`${this.apiUrl}/${id}`);
  }

  updateExpert(id: string, data: Partial<Expert>): Observable<{ message: string, expert: Expert }> {
    return this.http.put<{ message: string, expert: Expert }>(`${this.apiUrl}/${id}`, data);
  }

  notifyExpertUpdated(expert: Expert) {
    this.expertUpdatedSource.next(expert);
  }
}
