import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);

  // Utilizing the environment variable per security rules
  private apiUrl = environment.apiUrl;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  loadRazorpayScript(): Promise<boolean> {
    return new Promise(resolve => {
      if (isPlatformBrowser(this.platformId)) {
        // Check if script is already loaded
        if (document.getElementById('razorpay-checkout-js')) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.id = 'razorpay-checkout-js';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      } else {
        // If not in a browser, resolve to false.
        resolve(false);
      }
    });
  }

  createOrder(expertId: string, currency: string = 'INR'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment/create-order`, { expertId, currency });
  }

  verifyPayment(verificationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment/verify`, verificationData);
  }
}
