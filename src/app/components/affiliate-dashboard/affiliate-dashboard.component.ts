import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AffiliateService, AffiliateStats } from '../../services/affiliate.service';

@Component({
  selector: 'app-affiliate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="affiliate-container">
      <header class="page-header">
        <div>
          <span class="badge">GROWTH ENGINE</span>
          <h2>Automated Affiliate & Referral Program</h2>
          <p class="subtitle">Share your unique link and earn 10% on every booked session. Your referrals get 10% off!</p>
        </div>
      </header>

      <div *ngIf="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading your referral dashboard...</p>
      </div>

      <div *ngIf="!loading && stats" class="dashboard-grid">
        <!-- Guest Banner if not logged in -->
        <div *ngIf="stats.isAuthenticated === false" class="card login-banner">
          <div class="banner-content">
            <h3>🔒 Log in to claim your custom referral code</h3>
            <p>Sign in to your account to get your personalized tracking link and start earning 10% commissions.</p>
            <a routerLink="/login" class="btn btn-primary" style="display:inline-block; margin-top:0.75rem; text-decoration:none;">Log In / Register</a>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="stats-row">
          <div class="stat-card primary">
            <span class="stat-label">Total Affiliate Earnings</span>
            <div class="stat-value">₹{{ stats.affiliateBalance | number:'1.2-2' }}</div>
            <span class="stat-sub">10% commission on platform bookings</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Successful Referrals</span>
            <div class="stat-value">{{ stats.totalReferrals }}</div>
            <span class="stat-sub">Paying clients brought in</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Your Referral Code</span>
            <div class="stat-value code-text">{{ stats.referralCode }}</div>
            <span class="stat-sub">Give users 10% checkout discount</span>
          </div>
        </div>

        <!-- Referral Link Card -->
        <div class="card link-card">
          <h3>Your Unique Referral Link</h3>
          <p>Copy and share your personal link across social media, blogs, or newsletters.</p>
          
          <div class="input-group">
            <input type="text" readonly [value]="stats.referralLink" #linkInput />
            <button class="btn btn-primary" (click)="copyLink(stats.referralLink)">
              {{ copied ? 'Copied!' : 'Copy Link' }}
            </button>
          </div>

          <div class="social-share">
            <span>Quick Share:</span>
            <a [href]="getWhatsAppShareUrl()" target="_blank" class="social-btn whatsapp">WhatsApp</a>
            <a [href]="getTwitterShareUrl()" target="_blank" class="social-btn twitter">Twitter / X</a>
            <a [href]="getLinkedInShareUrl()" target="_blank" class="social-btn linkedin">LinkedIn</a>
          </div>
        </div>

        <!-- How it works -->
        <div class="card info-card">
          <h3>How The Affiliate Program Works</h3>
          <div class="steps-grid">
            <div class="step-item">
              <div class="step-number">1</div>
              <h4>Share Your Code</h4>
              <p>Send your code <strong>{{ stats.referralCode }}</strong> or referral link to colleagues, students, or clients.</p>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <h4>They Get a Discount</h4>
              <p>When they book an expert using your code, they get 10% off their checkout total instantly.</p>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <h4>You Get Paid</h4>
              <p>You automatically earn a 10% commission credited straight to your balance on every completed booking!</p>
            </div>
          </div>
        </div>

        <!-- Referral History Table -->
        <div class="card history-card">
          <h3>Referral & Payout Activity</h3>
          
          <div *ngIf="!stats.logs || stats.logs.length === 0" class="empty-state">
            <p>No referral transactions yet. Share your code to start earning passive income!</p>
          </div>

          <div *ngIf="stats.logs && stats.logs.length > 0" class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Referred User</th>
                  <th>Order Value</th>
                  <th>Commission (10%)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let log of stats.logs">
                  <td>{{ log.createdAt | date:'mediumDate' }}</td>
                  <td>{{ log.referredUserEmail || 'Guest Client' }}</td>
                  <td>₹{{ log.transactionAmount | number:'1.2-2' }}</td>
                  <td class="amount-positive">+₹{{ log.commissionEarned | number:'1.2-2' }}</td>
                  <td><span class="status-badge credited">{{ log.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .affiliate-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      color: #f3f4f6;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: white;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #9ca3af;
      margin-top: 0.25rem;
    }
    .login-banner {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.15));
      border: 1px solid rgba(99, 102, 241, 0.4);
      margin-bottom: 1.5rem;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
    }
    .stat-card.primary {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
      border-color: rgba(168, 85, 247, 0.4);
    }
    .stat-label {
      font-size: 0.875rem;
      color: #9ca3af;
      display: block;
      margin-bottom: 0.5rem;
    }
    .stat-value {
      font-size: 2.25rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.25rem;
    }
    .code-text {
      color: #60a5fa;
      font-family: monospace;
      letter-spacing: 1px;
    }
    .stat-sub {
      font-size: 0.75rem;
      color: #6b7280;
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
    }
    .input-group {
      display: flex;
      gap: 0.75rem;
      margin: 1rem 0;
    }
    .input-group input {
      flex: 1;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #60a5fa;
      font-family: monospace;
      font-size: 0.95rem;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .social-share {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
      font-size: 0.875rem;
      color: #9ca3af;
    }
    .social-btn {
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      color: white;
    }
    .social-btn.whatsapp { background: #25D366; }
    .social-btn.twitter { background: #1DA1F2; }
    .social-btn.linkedin { background: #0A66C2; }
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    .step-item {
      background: rgba(15, 23, 42, 0.5);
      border-radius: 12px;
      padding: 1.25rem;
      position: relative;
    }
    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #6366f1;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }
    .step-item h4 {
      margin-bottom: 0.5rem;
      color: #f3f4f6;
    }
    .step-item p {
      font-size: 0.85rem;
      color: #9ca3af;
      line-height: 1.4;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    .data-table th, .data-table td {
      padding: 0.875rem 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .data-table th {
      color: #9ca3af;
      font-size: 0.8rem;
      text-transform: uppercase;
    }
    .amount-positive {
      color: #10b981;
      font-weight: 700;
    }
    .status-badge.credited {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #9ca3af;
    }
    .loading-spinner {
      text-align: center;
      padding: 4rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AffiliateDashboardComponent implements OnInit {
  stats: AffiliateStats & { isAuthenticated?: boolean } | null = null;
  loading = true;
  copied = false;

  constructor(
    private affiliateService: AffiliateService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    if (!isPlatformBrowser(this.platformId)) {
      this.stats = {
        isAuthenticated: false,
        referralCode: 'JOIN-NOW',
        referralLink: 'https://consultnow.in/?ref=JOIN-NOW',
        affiliateBalance: 0,
        totalReferrals: 0,
        commissionPercent: 10,
        logs: []
      };
      this.loading = false;
      return;
    }

    this.affiliateService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Failed to load affiliate stats from server, using default view:', err);
        this.stats = {
          isAuthenticated: false,
          referralCode: 'JOIN-NOW',
          referralLink: 'https://consultnow.in/?ref=JOIN-NOW',
          affiliateBalance: 0,
          totalReferrals: 0,
          commissionPercent: 10,
          logs: []
        };
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  copyLink(link: string): void {
    if (!link) return;
    navigator.clipboard.writeText(link);
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }

  getWhatsAppShareUrl(): string {
    const text = encodeURIComponent(`Book 1-on-1 expert consultation on ConsultNow! Use code ${this.stats?.referralCode} for 10% off: ${this.stats?.referralLink}`);
    return `https://api.whatsapp.com/send?text=${text}`;
  }

  getTwitterShareUrl(): string {
    const text = encodeURIComponent(`Connect with top industry consultants on ConsultNow. Get 10% off with code ${this.stats?.referralCode}: ${this.stats?.referralLink}`);
    return `https://twitter.com/intent/tweet?text=${text}`;
  }

  getLinkedInShareUrl(): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.stats?.referralLink || '')}`;
  }
}
