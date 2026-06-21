import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Expert, ExpertService } from '../../services/expert.service';
import { ExpertMarketingToolComponent } from '../expert-marketing-tool/expert-marketing-tool';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, ExpertMarketingToolComponent],
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

        <!-- Expert Profile Details -->
        <div *ngIf="expert$ | async as expert" class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Welcome, {{ expert.name }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600"><span class="font-semibold">Email:</span> {{ expert.email }}</p>
              <p class="text-gray-600"><span class="font-semibold">Years of Experience:</span> {{ expert.yearsExperience }}</p>
            </div>
            <div>
              <p class="text-gray-600"><span class="font-semibold">Subject:</span> {{ expert.subjectExpertise }}</p>
              <p class="text-gray-600"><span class="font-semibold">Price per Hour:</span> \${{ expert.pricePerHour }}</p>
            </div>
          </div>
        </div>

        <!-- Dashboard Content -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <p class="text-gray-600">Your upcoming consultations and requests will appear here.</p>
        </div>
        
        <!-- AI Marketing Tool -->
        <app-expert-marketing-tool [expert]="expert$ | async"></app-expert-marketing-tool>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private expertService = inject(ExpertService);

  status: string | null = null;
  bookingId: string | null = null;
  statusMessage: string | null = null;
  
  expert$: Observable<Expert> | undefined;

  ngOnInit(): void {
    this.expertService.expertUpdated$.subscribe((updatedExpert: Expert) => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.id && updatedExpert.id === currentUser.id) {
        this.expert$ = this.expertService.getExpertById(currentUser.id);
      }
    });

    // Extract redirect parameters from the Accept/Reject email links
    this.status = this.route.snapshot.queryParamMap.get('status');
    this.bookingId = this.route.snapshot.queryParamMap.get('bookingId');

    if (this.status === 'accepted') {
      this.statusMessage = `Successfully accepted booking #${this.bookingId}. The user has been notified.`;
    } else if (this.status === 'rejected') {
      this.statusMessage = `You have rejected booking #${this.bookingId}. The user has been notified.`;
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.expert$ = this.expertService.getExpertById(currentUser.id);
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}