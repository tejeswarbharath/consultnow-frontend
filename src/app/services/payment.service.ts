import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  
  // Utilizing the environment variable per security rules
  private apiUrl = environment.apiUrl; 

  loadRazorpayScript(): Promise<boolean> {
    return new Promise(resolve => {
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
    });
  }

  createOrder(expertId: string, currency: string = 'INR'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment/create-order`, { expertId, currency });
  }

  verifyPayment(verificationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment/verify`, verificationData);
  }
}
