import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SeoProfileData {
  id: string;
  name: string;
  photoUrl?: string;
  subjectExpertise: string;
  yearsExperience: number;
  pricePerHour: number;
  currency: string;
  seoSlug?: string;
  seoBio?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  services: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  referralCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private apiUrl = `${environment.apiUrl}/seo`;

  constructor(private http: HttpClient) {}

  getProfileBySlug(slug: string): Observable<SeoProfileData> {
    return this.http.get<SeoProfileData>(`${this.apiUrl}/profile/${slug}`);
  }

  generateSeoProfile(expertId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate/${expertId}`, {});
  }
}
