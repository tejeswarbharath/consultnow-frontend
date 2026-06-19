import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { Expert, ExpertService } from '../../services/expert.service';

@Component({
  selector: 'app-expert-marketing-tool',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 class="text-lg font-semibold">AI Marketing Generator</h3>
      <p class="text-sm text-gray-600 mb-4">Enter your skills to generate a professional bio and marketing snippet.</p>
      <div class="flex flex-col gap-4">
        <textarea [(ngModel)]="skills" class="w-full p-2 border rounded" placeholder="e.g., Angular, Node.js, PostgreSQL, Cloud Architecture"></textarea>
        <button (click)="generateContent()" [disabled]="generating" class="btn btn-primary self-start">
          <span *ngIf="generating" class="loading loading-spinner"></span>
          {{ generating ? 'Generating...' : 'Generate' }}
        </button>
      </div>
      <div *ngIf="error" class="text-red-500 mt-2">{{ error }}</div>
    </div>
  `
})
export class ExpertMarketingToolComponent implements OnInit {
  @Input() expert: Expert | null = null;
  skills: string = '';
  generating: boolean = false;
  error: string | null = null;

  constructor(
    private aiService: AiService,
    private expertService: ExpertService
  ) {}

  ngOnInit(): void {
    // You could pre-fill skills from the expert's subjectExpertise if available
    if (this.expert?.subjectExpertise) {
      this.skills = this.expert.subjectExpertise.join(', ');
    }
  }

  generateContent(): void {
    if (!this.skills || !this.expert) return;

    this.generating = true;
    this.error = null;

    this.aiService.generateMarketingContent(this.skills).subscribe({
      next: (content) => {
        // Here you would typically update the expert's profile
        // For now, let's just log it and stop the loading spinner
        console.log('Generated Content:', content);
        this.generating = false; // This is the crucial part that was missing
      },
      error: (err) => {
        console.error('Failed to generate marketing content', err);
        this.error = 'Failed to generate content. Please try again.';
        this.generating = false; // Also stop loading on error
      }
    });
  }
}