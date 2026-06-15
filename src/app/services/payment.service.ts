import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  
  // Utilizing the environment variable per security rules
  private apiUrl = environment.apiUrl; 

  createCheckoutSession(serviceId: string, expertId: string): void {
    const payload = { serviceId, expertId };
    
    this.http.post<{ url: string }>(`${this.apiUrl}/create-checkout-session`, payload).subscribe({
      next: (response) => {
        if (response.url) {
          // Redirect the user's window to the Stripe Hosted Checkout URL
          window.location.href = response.url;
        }
      },
      error: (err) => {
        console.error('Failed to initialize checkout session:', err);
      }
    });
  }
}