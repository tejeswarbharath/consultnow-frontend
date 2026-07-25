import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService, SeoProfileData } from '../../services/seo.service';

@Component({
  selector: 'app-seo-expert-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="seo-page-container">
      <div *ngIf="loading" class="loader-wrapper">
        <div class="spinner"></div>
        <p>Loading Expert Profile...</p>
      </div>

      <div *ngIf="!loading && profile" class="profile-content">
        <!-- Breadcrumbs for SEO -->
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a routerLink="/">Home</a> &rsaquo;
          <a routerLink="/experts">Experts</a> &rsaquo;
          <span>{{ profile.name }}</span>
        </nav>

        <!-- Hero / Header Section -->
        <header class="expert-hero-card">
          <div class="hero-main">
            <div class="avatar-wrap">
              <img [src]="profile.photoUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + profile.name" [alt]="profile.name + ' - ' + profile.subjectExpertise" />
              <span class="online-indicator" title="Available for Booking"></span>
            </div>

            <div class="hero-details">
              <div class="badge-row">
                <span class="verified-badge">&#10003; Verified Consultant</span>
                <span class="exp-badge">{{ profile.yearsExperience }}+ Years Experience</span>
              </div>
              <h1>{{ profile.name }}</h1>
              <p class="expertise-title">{{ profile.subjectExpertise }} Specialist</p>

              <div class="pricing-row">
                <div class="price-tag">
                  <span class="currency">{{ profile.currency }}</span>
                  <span class="amount">₹{{ profile.pricePerHour }}</span>
                  <span class="unit">/ 60-min session</span>
                </div>
                <button class="btn-book" (click)="bookSession()">Book Consultation Session</button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Layout Grid -->
        <div class="layout-grid">
          <main class="primary-column">
            <!-- 300-Word AI Generated Bio -->
            <section class="content-card bio-section">
              <h2>About {{ profile.name }}</h2>
              <div class="bio-text">
                <p>{{ profile.seoBio }}</p>
              </div>
            </section>

            <!-- Key Services Grid -->
            <section class="content-card services-section" *ngIf="profile.services.length > 0">
              <h2>Specialized Services & Consultation Areas</h2>
              <div class="services-grid">
                <div class="service-card" *ngFor="let service of profile.services">
                  <div class="service-icon">&#9733;</div>
                  <h3>{{ service.title }}</h3>
                  <p>{{ service.description }}</p>
                </div>
              </div>
            </section>

            <!-- Frequently Asked Questions (FAQ) with Schema Markup -->
            <section class="content-card faq-section" *ngIf="profile.faqs.length > 0">
              <h2>Frequently Asked Questions</h2>
              <div class="faq-list">
                <details class="faq-item" *ngFor="let faq of profile.faqs; let i = index" [open]="i === 0">
                  <summary class="faq-question">
                    <span>{{ faq.question }}</span>
                    <span class="arrow">&darr;</span>
                  </summary>
                  <p class="faq-answer">{{ faq.answer }}</p>
                </details>
              </div>
            </section>
          </main>

          <!-- Sidebar Booking Widget -->
          <aside class="sidebar-column">
            <div class="sticky-booking-card">
              <h3>Reserve Your Slot</h3>
              <p>Direct 1-on-1 private video call session with instant calendar sync.</p>
              
              <ul class="perks-list">
                <li>&#10004; Direct Video Call via Google Meet</li>
                <li>&#10004; Personalized Action Plan</li>
                <li>&#10004; 100% Satisfaction Guarantee</li>
              </ul>

              <button class="btn-book full-width" (click)="bookSession()">Book Session Now</button>

              <div *ngIf="profile.referralCode" class="promo-hint">
                <span>Have promo code? Enter <strong>{{ profile.referralCode }}</strong> for 10% off.</span>
              </div>
            </div>
          </aside>
        </div>

        <!-- Viral Powered By Watermark Footer -->
        <footer class="viral-footer">
          <a href="https://consultnow.in/?utm_source=seo_profile&utm_medium=organic_search&utm_campaign=powered_by_loop" target="_blank" class="powered-by-link">
            <span>Powered by <strong>ConsultNow</strong> — Expert Advisory Platform</span>
          </a>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .seo-page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      color: #f3f4f6;
    }
    .breadcrumbs {
      font-size: 0.85rem;
      color: #9ca3af;
      margin-bottom: 1.5rem;
    }
    .breadcrumbs a {
      color: #818cf8;
      text-decoration: none;
    }
    .expert-hero-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
    }
    .hero-main {
      display: flex;
      gap: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .avatar-wrap {
      position: relative;
      width: 120px;
      height: 120px;
    }
    .avatar-wrap img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #6366f1;
    }
    .online-indicator {
      position: absolute;
      bottom: 6px;
      right: 6px;
      width: 18px;
      height: 18px;
      background: #10b981;
      border: 3px solid #0f172a;
      border-radius: 50%;
    }
    .hero-details {
      flex: 1;
      min-width: 280px;
    }
    .badge-row {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .verified-badge {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 9999px;
    }
    .exp-badge {
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 9999px;
    }
    h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0.25rem 0;
      color: #ffffff;
    }
    .expertise-title {
      font-size: 1.1rem;
      color: #94a3b8;
      margin-bottom: 1.25rem;
    }
    .pricing-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .price-tag .amount {
      font-size: 1.75rem;
      font-weight: 800;
      color: #38bdf8;
    }
    .price-tag .currency {
      font-weight: 700;
      margin-right: 2px;
    }
    .price-tag .unit {
      font-size: 0.85rem;
      color: #94a3b8;
      margin-left: 4px;
    }
    .btn-book {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: white;
      border: none;
      padding: 0.85rem 1.75rem;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
      transition: all 0.2s;
    }
    .btn-book:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
    }
    .btn-book.full-width {
      width: 100%;
      margin-top: 1rem;
    }
    .layout-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    @media (max-width: 900px) {
      .layout-grid { grid-template-columns: 1fr; }
    }
    .content-card {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 2rem;
    }
    .content-card h2 {
      font-size: 1.35rem;
      margin-bottom: 1rem;
      color: #ffffff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.75rem;
    }
    .bio-text p {
      font-size: 1.05rem;
      line-height: 1.75;
      color: #cbd5e1;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;
    }
    .service-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .service-icon {
      color: #fbbf24;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    .service-card h3 {
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
      color: #f8fafc;
    }
    .service-card p {
      font-size: 0.875rem;
      color: #94a3b8;
      line-height: 1.5;
    }
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .faq-item {
      background: rgba(15, 23, 42, 0.6);
      border-radius: 10px;
      padding: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .faq-question {
      font-weight: 600;
      color: #38bdf8;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .faq-answer {
      margin-top: 0.75rem;
      color: #cbd5e1;
      font-size: 0.95rem;
      line-height: 1.6;
    }
    .sticky-booking-card {
      position: sticky;
      top: 2rem;
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
    }
    .sticky-booking-card h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .perks-list {
      list-style: none;
      padding: 0;
      margin: 1.25rem 0;
    }
    .perks-list li {
      font-size: 0.875rem;
      color: #cbd5e1;
      margin-bottom: 0.5rem;
    }
    .promo-hint {
      margin-top: 1rem;
      font-size: 0.8rem;
      color: #a7f3d0;
      text-align: center;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.5rem;
      border-radius: 6px;
    }
    .viral-footer {
      text-align: center;
      margin-top: 3rem;
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .powered-by-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .powered-by-link:hover {
      color: #818cf8;
    }
    .loader-wrapper {
      text-align: center;
      padding: 5rem;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SeoExpertProfileComponent implements OnInit {
  profile: SeoProfileData | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seoService: SeoService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.fetchProfile(slug);
      }
    });
  }

  fetchProfile(slug: string): void {
    this.loading = true;
    this.seoService.getProfileBySlug(slug).subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
        this.applySeoMeta(data);
        this.injectJsonLdSchema(data);
      },
      error: (err) => {
        console.error('Error loading SEO profile:', err);
        this.loading = false;
      }
    });
  }

  applySeoMeta(data: SeoProfileData): void {
    const title = data.seoMetaTitle || `${data.name} - ${data.subjectExpertise} Consultant | ConsultNow`;
    const desc = data.seoMetaDescription || `Book a 1-on-1 strategy session with ${data.name}. Expert guidance in ${data.subjectExpertise}.`;

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: desc });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: desc });
    this.metaService.updateTag({ property: 'og:type', content: 'profile' });
  }

  injectJsonLdSchema(data: SeoProfileData): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": data.name,
      "jobTitle": `${data.subjectExpertise} Expert`,
      "description": data.seoBio,
      "offers": {
        "@type": "Offer",
        "price": data.pricePerHour,
        "priceCurrency": data.currency || "INR",
        "availability": "https://schema.org/InStock"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  bookSession(): void {
    if (this.profile) {
      this.router.navigate(['/booking', this.profile.id]);
    }
  }
}
