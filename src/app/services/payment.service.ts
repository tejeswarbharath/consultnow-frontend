import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

// FIX: Declare Razorpay globally so TypeScript knows it exists
declare var Razorpay: any; 

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payment`;
  
  // Keep track of the current checkout context
  private currentExpertId: string | null = null;
  private currentGuestData: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Step 1: Send cart/expert data to backend to generate a Razorpay Order
   */
  createOrder(payload: { expertId: string, amount: number, currency: string, guestData: any }): Observable<any> {
    // Store the checkout context so we can use it during verification
    this.currentExpertId = payload.expertId;
    this.currentGuestData = payload.guestData;
    
    return this.http.post(`${this.apiUrl}/create-order`, payload);
  }

  /**
   * Step 2: Open the Razorpay Checkout Modal
   * FIX: Now returns a Promise so the BookingComponent can use .then() and .catch()
   */
  openRazorpayModal(orderData: any, guestName: string, guestEmail: string, selectedSlot: Date | null, hoursCount: number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        reject('Server-side rendering, cannot open modal.');
        return; 
      }

      try {
        const options = {
          // NOTE: Ensure your environment.ts has razorpayKeyId defined
          key: (environment as any).razorpayKeyId || '', 
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'ConsultNow',
          description: 'Secure Expert Consultation Booking',
          order_id: orderData.orderId,
          handler: (response: any) => {
            // This callback runs when Razorpay successfully captures the payment
            this.verifyPayment(response, selectedSlot, hoursCount);
          },
          prefill: {
            name: guestName,
            email: guestEmail
          },
          theme: {
            color: '#4f46e5' // Premium Indigo
          }
        };

        const rzp = new Razorpay(options);
        
        rzp.on('payment.failed', (response: any) => {
          console.error('Payment Failed', response.error);
          this.router.navigate(['/payment-failure']);
        });
        
        rzp.open();
        
        // Resolve the promise so the component turns off the 'Processing...' spinner
        resolve(); 
      } catch (error) {
        console.error('Failed to initialize Razorpay', error);
        reject(error);
      }
    });
  }

  /**
   * Step 3: Verify the digital signature on the backend and complete automation
   */
  private verifyPayment(response: any, selectedSlot: Date | null, hoursCount: number = 1) {
    const endTime = selectedSlot ? new Date(selectedSlot) : null;
    if (endTime) {
      endTime.setHours(endTime.getHours() + hoursCount);
    }

    const verificationPayload = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      expertId: this.currentExpertId,
      guestData: this.currentGuestData,
      startTime: selectedSlot,
      endTime: endTime
    };

    this.http.post(`${this.apiUrl}/verify-payment`, verificationPayload).subscribe({
      next: (res) => {
        console.log('Payment & Booking Confirmed!', res);
        this.router.navigate(['/payment-success']);
      },
      error: (err) => {
        console.error('Verification failed', err);
        this.router.navigate(['/payment-failure']);
      }
    });
  }
}