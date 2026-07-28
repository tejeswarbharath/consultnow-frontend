import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isBrowser: boolean;
  private gaMeasurementId: string;
  private scriptInitialized = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.gaMeasurementId = environment.gaMeasurementId || '';

    if (this.isBrowser) {
      this.initGoogleAnalytics();
      this.trackRouteChanges();
    }
  }

  /**
   * Dynamically loads the gtag.js script and initializes window.dataLayer / gtag function
   */
  private initGoogleAnalytics(): void {
    if (this.scriptInitialized || !this.gaMeasurementId) {
      return;
    }

    try {
      // Create gtag script element
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaMeasurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag function
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.gaMeasurementId, { send_page_view: false });

      this.scriptInitialized = true;
    } catch (e) {
      console.error('Error initializing Google Analytics:', e);
    }
  }

  /**
   * Listens to router navigation events and tracks page views
   */
  private trackRouteChanges(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  /**
   * Track page views in Google Analytics
   */
  public trackPageView(pagePath?: string, title?: string): void {
    if (!this.isBrowser || !window.gtag || !this.gaMeasurementId) {
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: pagePath || window.location.pathname,
      page_title: title || document.title
    });
  }

  /**
   * Track custom events in Google Analytics
   */
  public trackEvent(eventName: string, eventParams?: Record<string, any>): void {
    if (!this.isBrowser || !window.gtag || !this.gaMeasurementId) {
      return;
    }

    window.gtag('event', eventName, eventParams);
  }
}
