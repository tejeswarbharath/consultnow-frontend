import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Expert Dashboard</h1>

        <!-- Notification Banner from Email Redirects -->
        <div *ngIf="statusMessage"
             [ngClass]="{'bg-green-100 text-green-800 border-green-300': status === 'accepted', 'bg-red-100 text-red-800 border-red-300': status === 'rejected'}"
             class="px-4 py-3 rounded border mb-6 shadow-sm">
          <span class="block sm:inline">{{ statusMessage }}</span>
        </div>

        <!-- Dashboard Content -->
        <div class="bg-white shadow rounded-lg p-6">
          <p class="text-gray-600">Your upcoming consultations and requests will appear here.</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  status: string | null = null;
  bookingId: string | null = null;
  statusMessage: string | null = null;

  ngOnInit(): void {
    // Extract redirect parameters from the Accept/Reject email links
    this.status = this.route.snapshot.queryParamMap.get('status');
    this.bookingId = this.route.snapshot.queryParamMap.get('bookingId');

    if (this.status === 'accepted') {
      this.statusMessage = `Successfully accepted booking #${this.bookingId}. The user has been notified.`;
    } else if (this.status === 'rejected') {
      this.statusMessage = `You have rejected booking #${this.bookingId}. The user has been notified.`;
    }
  }
}