import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
        <div class="flex justify-center">
          <svg class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Payment Successful!</h2>
        <p class="mt-2 text-sm text-gray-600">Your consultation has been booked successfully.</p>
        
        <div class="mt-4 bg-gray-100 p-4 rounded-md">
          <p class="text-sm text-gray-700 font-medium">Reference Number:</p>
          <p class="text-xs text-gray-500 break-all mt-1">{{ sessionId || 'N/A' }}</p>
        </div>
        
        <div class="mt-6">
          <a routerLink="/" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class PaymentSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  sessionId: string | null = '';

  ngOnInit(): void {
    // Extract the Stripe session_id from query parameters
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
  }
}