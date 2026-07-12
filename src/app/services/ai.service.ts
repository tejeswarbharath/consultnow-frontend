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

  // triage method to use the centralized environment API URL
  triageProblem(problemDescription: string): Observable<{
    recommendedCategory: string;
    reason?: string;
    isEmergency?: boolean;
    disclaimer?: string;
  }> {
    return this.http.post<{
      recommendedCategory: string;
      reason?: string;
      isEmergency?: boolean;
      disclaimer?: string;
    }>(`${this.apiUrl}/triage`, { problemDescription });
  }

  // get LLM generated expert summaries customized to user's search query
  getExpertSummaries(query: string, experts: any[]): Observable<{ summaries: { [expertId: string]: string } }> {
    return this.http.post<{ summaries: { [expertId: string]: string } }>(`${this.apiUrl}/expert-summaries`, { query, experts });
  }

  // Chat with the AI Twin of an expert
  chatWithExpertTwin(expertId: string, message: string, history: any[]): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(`${this.apiUrl}/expert-twin-chat`, { expertId, message, history });
  }
}