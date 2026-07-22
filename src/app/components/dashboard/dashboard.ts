import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Expert, ExpertService } from '../../services/expert.service';
import { ExpertMarketingTool } from '../expert-marketing-tool/expert-marketing-tool';
import { AuthService } from '../../services/auth.service';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ExpertMarketingTool],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private expertService = inject(ExpertService);
  private authService = inject(AuthService);
  private aiService = inject(AiService);
  private cdr = inject(ChangeDetectorRef);
  
  expert: Expert | null = null;
  isLoading = true;

  // AI Intake Briefing Digest state
  clientNotesInput = '';
  briefingData: { summary: string; keyFocus: string; suggestedApproach: string } | null = null;
  isBriefingLoading = false;

  // AI Follow-up Email Generator state
  followUpClientName = '';
  followUpTopic = '';
  followUpNotes = '';
  followUpData: { subject: string; emailBody: string; actionItems: string[] } | null = null;
  isFollowUpLoading = false;

  ngOnInit() {
    const token = this.authService.getToken();

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expertId = payload.expertId || payload.id;
        
        if (expertId) {
          this.expertService.getExpertById(expertId).subscribe({
            next: (fullExpertData) => {
              this.expert = fullExpertData;
              this.isLoading = false;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Failed to load full expert details', err);
              this.isLoading = false;
              this.cdr.detectChanges();
            }
          });
        }
      } catch (error) {
        console.error('Error decoding JWT token', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }

    this.expertService.expertUpdated$.subscribe((updatedExpert: Expert) => {
      this.expert = updatedExpert;
      this.cdr.detectChanges();
    });
  }

  generateBriefing() {
    if (!this.clientNotesInput.trim()) return;
    this.isBriefingLoading = true;
    this.briefingData = null;

    this.aiService.generateBriefing(this.clientNotesInput, this.expert?.subjectExpertise).subscribe({
      next: (res) => {
        this.briefingData = res;
        this.isBriefingLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to generate briefing:', err);
        this.isBriefingLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  generateFollowUp() {
    if (!this.followUpClientName.trim() || !this.followUpTopic.trim()) return;
    this.isFollowUpLoading = true;
    this.followUpData = null;

    this.aiService.generateFollowUp(this.followUpClientName, this.followUpTopic, this.followUpNotes).subscribe({
      next: (res) => {
        this.followUpData = res;
        this.isFollowUpLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to generate follow-up:', err);
        this.isFollowUpLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Price Per Hour Editing state
  isEditingPrice = false;
  editedPrice = 0;
  isSavingPrice = false;
  priceSuccessMsg = '';
  priceErrorMsg = '';

  startEditingPrice() {
    if (!this.expert) return;
    this.editedPrice = this.expert.pricePerHour;
    this.isEditingPrice = true;
    this.priceSuccessMsg = '';
    this.priceErrorMsg = '';
    this.cdr.detectChanges();
  }

  cancelEditingPrice() {
    this.isEditingPrice = false;
    this.priceSuccessMsg = '';
    this.priceErrorMsg = '';
    this.cdr.detectChanges();
  }

  savePrice() {
    if (!this.expert || this.editedPrice < 0) {
      this.priceErrorMsg = 'Please enter a valid price.';
      return;
    }

    this.isSavingPrice = true;
    this.priceSuccessMsg = '';
    this.priceErrorMsg = '';
    this.cdr.detectChanges();

    this.expertService.updateExpert(this.expert.id, { pricePerHour: this.editedPrice }).subscribe({
      next: (res) => {
        this.isSavingPrice = false;
        this.isEditingPrice = false;
        if (this.expert) {
          this.expert.pricePerHour = this.editedPrice;
          this.expertService.notifyExpertUpdated(this.expert);
        }
        this.priceSuccessMsg = 'Price per hour updated successfully!';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update price per hour:', err);
        this.isSavingPrice = false;
        this.priceErrorMsg = 'Failed to update price. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}