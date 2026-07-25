import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-embed-widget-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget-card" [class.theme-light]="theme === 'light'" [class.theme-gradient]="theme === 'gradient'">
      <div *ngIf="loading" class="spinner"></div>

      <div *ngIf="!loading && expert" class="card-inner">
        <div class="header-row">
          <img [src]="expert.photoUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + expert.name" [alt]="expert.name" class="avatar" />
          <div class="info">
            <h4 class="name">{{ expert.name }}</h4>
            <p class="subject">{{ expert.subjectExpertise }}</p>
            <span class="exp-tag">{{ expert.yearsExperience }}+ Yrs Exp</span>
          </div>
        </div>

        <div class="action-row">
          <div class="rate">
            <span class="currency">{{ expert.currency || 'INR' }}</span>
            <span class="amount">₹{{ expert.pricePerHour }}</span>
            <span class="period">/ hr</span>
          </div>

          <a [href]="getBookingUrl()" target="_blank" class="btn-book">Book Session</a>
        </div>

        <div class="viral-watermark">
          <a [href]="getPlatformUrl()" target="_blank">
            <span>Powered by <strong>ConsultNow</strong></span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .widget-card {
      background: #0f172a;
      color: #f8fafc;
      padding: 1.25rem;
      border-radius: 12px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .widget-card.theme-light {
      background: #ffffff;
      color: #0f172a;
      border-color: #e2e8f0;
    }
    .widget-card.theme-gradient {
      background: linear-gradient(135deg, #1e1b4b, #31104b);
      color: #ffffff;
    }
    .header-row {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #6366f1;
    }
    .info {
      flex: 1;
    }
    .name {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
    }
    .subject {
      margin: 2px 0 4px;
      font-size: 0.8rem;
      opacity: 0.8;
    }
    .exp-tag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .theme-light .exp-tag {
      background: #e0e7ff;
      color: #4338ca;
    }
    .action-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .theme-light .action-row {
      border-top-color: #f1f5f9;
    }
    .rate .amount {
      font-size: 1.25rem;
      font-weight: 800;
      color: #38bdf8;
    }
    .theme-light .rate .amount {
      color: #0284c7;
    }
    .rate .period {
      font-size: 0.75rem;
      opacity: 0.7;
    }
    .btn-book {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: 8px;
    }
    .viral-watermark {
      margin-top: 0.75rem;
      text-align: center;
      font-size: 0.725rem;
    }
    .viral-watermark a {
      color: #94a3b8;
      text-decoration: none;
    }
    .theme-light .viral-watermark a {
      color: #64748b;
    }
    .viral-watermark strong {
      color: #818cf8;
    }
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 1rem auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class EmbedWidgetViewComponent implements OnInit {
  expert: any = null;
  theme = 'dark';
  style = 'card';
  loading = true;
  expertId = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.expertId = params['id'];
    });

    this.route.queryParams.subscribe(qp => {
      this.theme = qp['theme'] || 'dark';
      this.style = qp['style'] || 'card';
    });

    if (this.expertId) {
      this.fetchExpertData();
    }
  }

  fetchExpertData(): void {
    this.http.get(`${environment.apiUrl}/widgets/expert/${this.expertId}`).subscribe({
      next: (res: any) => {
        this.expert = res.expert;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load embed widget data:', err);
        this.loading = false;
      }
    });
  }

  getBookingUrl(): string {
    const origin = window.location.origin;
    const refCode = this.expert?.referralCode ? `&ref=${this.expert.referralCode}` : '';
    return `${origin}/booking/${this.expertId}?utm_source=embed_widget&utm_medium=external_site&utm_campaign=powered_by_loop${refCode}`;
  }

  getPlatformUrl(): string {
    const origin = window.location.origin;
    return `${origin}/?utm_source=embed_widget&utm_medium=watermark&utm_campaign=viral_loop`;
  }
}
