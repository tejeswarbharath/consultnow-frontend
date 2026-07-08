import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Expert {
  id: string;
  name: string;
  email?: string; // Restored for dashboard.component.ts
  photoUrl?: string;
  yearsExperience: number;
  pricePerHour: number;
  subjectExpertise: string;
  isAvailable: boolean;
  bio?: string;
  marketingSnippet?: string;
  currency?: string;
  category?: { name: string }; // Restored strictly to prevent template compilation errors
}

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private apiUrl = `${environment.apiUrl}/experts`;

  // Restored Subject for marketing tool notifications
  private expertUpdatedSource = new Subject<Expert>();
  expertUpdated$ = this.expertUpdatedSource.asObservable();

  // Share category filter between components (chatbot -> discovery)
  private categoryFilterSource = new Subject<string | null>();
  categoryFilter$ = this.categoryFilterSource.asObservable();

  setCategoryFilter(category: string | null) {
    this.categoryFilterSource.next(category);
  }

  constructor(private http: HttpClient) { }

  // Restored to fix chat.component.ts inference errors
  getExperts(): Observable<Expert[]> {
    return this.http.get<Expert[]>(this.apiUrl);
  }

  getExpertsGroupedBySubject(): Observable<{ [key: string]: Expert[] }> {
    return this.http.get<{ [key: string]: Expert[] }>(`${this.apiUrl}?groupBy=subjectExpertise`);
  }

  getExpertById(id: string): Observable<Expert> {
    return this.http.get<Expert>(`${this.apiUrl}/${id}`);
  }

  // Restored to fix expert-marketing-tool.ts
  updateExpert(id: string, data: Partial<Expert>): Observable<{ message?: string, expert: Expert }> {
    return this.http.put<{ message?: string, expert: Expert }>(`${this.apiUrl}/${id}`, data);
  }

  // Restored notification trigger
  notifyExpertUpdated(expert: Expert) {
    this.expertUpdatedSource.next(expert);
  }
}