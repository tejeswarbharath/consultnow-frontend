import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AffiliateStats {
  referralCode: string;
  referralLink: string;
  affiliateBalance: number;
  totalReferrals: number;
  commissionPercent: number;
  logs: any[];
}

export interface PromoValidationResult {
  valid: boolean;
  referralCode?: string;
  referrerName?: string;
  discountPercent?: number;
  discountAmount?: number;
  originalAmount?: number;
  finalAmount?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AffiliateService {
  private apiUrl = `${environment.apiUrl}/affiliate`;

  constructor(private http: HttpClient) {}

  validateCode(code: string, amount: number): Observable<PromoValidationResult> {
    return this.http.post<PromoValidationResult>(`${this.apiUrl}/validate`, { code, amount });
  }

  getStats(): Observable<AffiliateStats> {
    return this.http.get<AffiliateStats>(`${this.apiUrl}/stats`);
  }
}
