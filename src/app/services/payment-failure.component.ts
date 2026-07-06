import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[var(--b1)] py-12 px-4 sm:px-6 lg:px-8 text-[var(--bc)]">
      <div class="max-w-md w-full space-y-8 bg-[var(--b2)] border border-[var(--b3)] p-8 rounded-2xl shadow-2xl text-center">
        <div class="flex justify-center">
          <svg class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="mt-6 text-2xl font-extrabold text-white">Payment Failed</h2>
        
        <div class="mt-4 bg-slate-950/30 p-4 rounded-xl border border-[var(--b3)] text-left" *ngIf="referenceId">
          <p class="text-xs font-bold uppercase tracking-wider text-[var(--bc)]/50">Reference Number</p>
          <p class="text-xs font-semibold text-red-400 break-all mt-1.5">{{ referenceId }}</p>
        </div>

        <p class="mt-2 text-sm text-[var(--bc)]/60">Do you want to retry the payment or go back?</p>
        
        <div class="mt-6 flex flex-col space-y-3">
          <button (click)="retry()" class="glow-btn-primary w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white cursor-pointer focus:outline-none transition-all">
            Retry Payment
          </button>
          <a routerLink="/" class="w-full flex justify-center py-3 px-4 border border-[var(--b3)] bg-slate-950/20 text-[var(--bc)] hover:bg-slate-900/40 rounded-xl text-sm font-semibold transition-all">
            Cancel
          </a>
        </div>
      </div>
    </div>
  `
})
export class PaymentFailureComponent implements OnInit {
  private route = inject(ActivatedRoute);
  referenceId: string | null = '';

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.referenceId = this.route.snapshot.queryParamMap.get('reference_id');
  }

  retry(): void {
    // Navigates the user back to the previous page where they can initiate checkout again
    this.location.back();
  }
}