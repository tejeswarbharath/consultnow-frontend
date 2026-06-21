import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Expert, ExpertService } from '../../services/expert.service';

@Component({
  selector: 'app-expert-marketing-tool',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6 mt-6 border border-gray-200">
      <div class="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2 class="text-xl font-bold text-gray-900">AI Marketing Generator</h2>
      </div>

      <p class="text-gray-600 mb-4 text-sm">
        Let AI craft your professional bio and promotional materials. Your current expertise is pre-filled.
      </p>

      <div class="mb-4">
        <label for="skills" class="block text-sm font-medium text-gray-700 mb-1">Your Skills & Experience</label>
        <textarea
          id="skills"
          [(ngModel)]="skillsInput"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          placeholder="e.g. 10 years experience in corporate law, specializing in mergers and acquisitions. Fluent in Spanish."
        ></textarea>
      </div>

      <div *ngIf="error" class="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
        {{ error }}
      </div>

      <div *ngIf="successMessage" class="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-md">
        {{ successMessage }}
      </div>

      <button
        (click)="generateMarketing()"
        [disabled]="isLoading"
        class="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 font-medium"
      >
        <span *ngIf="isLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
        <span>{{ isLoading ? 'Generating...' : 'Generate Magic' }}</span>
      </button>

      <!-- Results Section -->
      <div *ngIf="marketingData" class="mt-8 space-y-6 animate-fade-in-up">
        <hr class="border-gray-200">

        <!-- Professional Bio -->
        <div *ngIf="marketingData.bio || marketingData.professionalBio">
          <h3 class="text-md font-semibold text-gray-800 mb-2">Generated Professional Bio</h3>
          <div class="bg-gray-50 p-4 rounded-md text-sm text-gray-700 border border-gray-100 whitespace-pre-wrap">
            {{ marketingData.bio || marketingData.professionalBio }}
          </div>
        </div>

        <!-- Marketing Snippet / Service Description -->
        <div *ngIf="marketingData.marketingSnippet || marketingData.serviceDescription">
          <h3 class="text-md font-semibold text-gray-800 mb-2">Generated Marketing Snippet</h3>
          <div class="bg-purple-50 p-4 rounded-md text-sm text-purple-900 border border-purple-100 italic">
            "{{ marketingData.marketingSnippet || marketingData.serviceDescription }}"
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            (click)="saveToProfile()"
            [disabled]="isSaving"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 font-medium"
          >
            <span *ngIf="isSaving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ isSaving ? 'Saving...' : 'Save to Profile' }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './expert-marketing-tool.scss'
})
export class ExpertMarketingToolComponent implements OnChanges {
  @Input() expert: Expert | null = null;
  @Output() expertUpdated = new EventEmitter<Expert>();
  skillsInput: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  marketingData: any = null;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private expertService: ExpertService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expert'] && this.expert) {
      this.skillsInput = this.expert.subjectExpertise;
    }
  }

  generateMarketing() {
    if (!this.skillsInput.trim()) {
      this.error = 'Please enter some skills.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.marketingData = null;

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.apiUrl}/ai/generate-marketing`, 
      { skills: this.skillsInput }, 
      { headers }
    ).subscribe({
      next: (data) => {
        this.marketingData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Marketing Generation Error', err);
        this.error = 'Failed to generate marketing content. Please try again.';
        this.isLoading = false;
      }
    });
  }

  saveToProfile() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id || !this.marketingData) return;

    this.isSaving = true;
    this.error = null;
    this.successMessage = null;

    const updateData = {
      bio: this.marketingData.bio || this.marketingData.professionalBio,
      marketingSnippet: this.marketingData.marketingSnippet || this.marketingData.serviceDescription
    };

    this.expertService.updateExpert(user.id, updateData).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.successMessage = 'Your profile has been updated with the new content!';
        this.marketingData = null; // Clear generated data after saving
        this.expertService.notifyExpertUpdated(response.expert);
        this.expertUpdated.emit(response.expert);
      },
      error: (err) => {
        console.error('Failed to save profile', err);
        this.error = 'Failed to save profile. Please try again.';
        this.isSaving = false;
      }
    });
  }
}
