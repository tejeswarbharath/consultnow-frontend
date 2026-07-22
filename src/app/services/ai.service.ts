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

  // Generate 3-step consultation prep agenda for clients
  generateAgenda(problemDetails: string, expertSubject: string): Observable<{ agenda: string[] }> {
    return this.http.post<{ agenda: string[] }>(`${this.apiUrl}/agenda`, { problemDetails, expertSubject });
  }

  // Generate 30-second pre-call intake briefing digest for experts
  generateBriefing(clientNotes: string, bookingType?: string): Observable<{ summary: string; keyFocus: string; suggestedApproach: string }> {
    return this.http.post<{ summary: string; keyFocus: string; suggestedApproach: string }>(`${this.apiUrl}/briefing`, { clientNotes, bookingType });
  }

  // Generate post-consultation follow-up email draft and session summary
  generateFollowUp(clientName: string, topic: string, notes?: string): Observable<{ subject: string; emailBody: string; actionItems: string[] }> {
    return this.http.post<{ subject: string; emailBody: string; actionItems: string[] }>(`${this.apiUrl}/followup`, { clientName, topic, notes });
  }

  // Recommend expert pricing based on market benchmarks
  recommendPricing(yearsExperience: number, subjectExpertise: string, currentRate?: number): Observable<{ recommendedPrice: number; priceRange: string; rationale: string }> {
    return this.http.post<{ recommendedPrice: number; priceRange: string; rationale: string }>(`${this.apiUrl}/recommend-pricing`, { yearsExperience, subjectExpertise, currentRate });
  }
}