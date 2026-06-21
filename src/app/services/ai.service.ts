import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MarketingContent {
  bio: string;
  marketingSnippet: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) { }

  generateMarketingContent(skills: string): Observable<MarketingContent> {
    return this.http.post<MarketingContent>(`${this.apiUrl}/generate-marketing`, { skills });
  }

  // FIX: Added the triage method to use the centralized environment API URL
  triageProblem(problemDescription: string): Observable<{recommendedCategory: string}> {
    return this.http.post<{recommendedCategory: string}>(`${this.apiUrl}/triage`, { problemDescription });
  }
}