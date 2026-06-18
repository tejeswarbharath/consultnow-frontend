import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ExpertMarketingTool } from '../expert-marketing-tool/expert-marketing-tool';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, ExpertMarketingTool],
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Expert Dashboard</h1>
          <div class="flex gap-4">
            <button routerLink="/expert-profile" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">View Profile</button>
            <button (click)="onLogout()" class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">Logout</button>
          </div>
        </div>

        <!-- Notification Banner from Email Redirects -->
        <div *ngIf="statusMessage"
             [ngClass]="{'bg-green-100 text-green-800 border-green-300': status === 'accepted', 'bg-red-100 text-red-800 border-red-300': status === 'rejected'}"
             class="px-4 py-3 rounded border mb-6 shadow-sm">
          <span class="block sm:inline">{{ statusMessage }}</span>
        </div>

        <!-- Dashboard Content -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <p class="text-gray-600">Your upcoming consultations and requests will appear here.</p>
        </div>
        
        <!-- AI Marketing Tool -->
        <app-expert-marketing-tool></app-expert-marketing-tool>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
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

  onLogout(): void {
    this.authService.logout();
  }
}