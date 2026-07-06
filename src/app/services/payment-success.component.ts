import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[var(--b1)] py-12 px-4 sm:px-6 lg:px-8 text-[var(--bc)]">
      <div class="max-w-md w-full space-y-8 bg-[var(--b2)] border border-[var(--b3)] p-8 rounded-2xl shadow-2xl text-center">
        <div class="flex justify-center">
          <svg class="h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-white">Payment Successful!</h2>
        <p class="mt-2 text-sm text-[var(--bc)]/60">Your consultation has been booked successfully. Thank you for using ConsultNow.</p>
        
        <div class="mt-4 bg-slate-950/30 p-4 rounded-xl border border-[var(--b3)]">
          <p class="text-xs font-bold uppercase tracking-wider text-[var(--bc)]/50">Reference Number</p>
          <p class="text-xs font-semibold text-emerald-400 break-all mt-1.5">{{ referenceId || 'N/A' }}</p>
        </div>
        
        <div class="mt-6">
          <a routerLink="/" class="glow-btn-primary w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white cursor-pointer focus:outline-none transition-all">
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class PaymentSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  referenceId: string | null = '';

  ngOnInit(): void {
    // Extract the Razorpay payment_id from query parameters
    this.referenceId = this.route.snapshot.queryParamMap.get('reference_id');
  }
}