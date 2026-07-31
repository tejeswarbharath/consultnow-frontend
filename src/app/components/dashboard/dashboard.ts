import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Expert, ExpertService } from '../../services/expert.service';
import { ExpertMarketingTool } from '../expert-marketing-tool/expert-marketing-tool';
import { AuthService } from '../../services/auth.service';
import { AiService } from '../../services/ai.service';
import { ToastService } from '../../services/toast.service';

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
  private toastService = inject(ToastService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  
  expert: Expert | null = null;
  isLoading = true;
  errorMessage = '';

  // Active Dashboard Tab
  activeTab: 'overview' | 'profile' | 'marketing' | 'briefing' | 'followup' = 'overview';

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
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    } else {
      this.isLoading = false;
    }

    this.expertService.expertUpdated$.subscribe((updatedExpert: Expert) => {
      this.expert = updatedExpert;
      this.cdr.detectChanges();
    });
  }

  loadDashboardData() {
    this.isLoading = true;
    this.errorMessage = '';
    const user = this.authService.getCurrentUser();
    const token = this.authService.getToken();

    let expertId = user?.id || user?.expertId;

    if (!expertId && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        expertId = payload.expertId || payload.id || payload.sub || payload._id;
      } catch (e) {
        console.error('Failed to parse token in dashboard', e);
      }
    }

    if (!expertId) {
      this.isLoading = false;
      this.errorMessage = 'Please sign in to access the expert dashboard.';
      this.cdr.detectChanges();
      return;
    }

    this.expertService.getExpertById(expertId).subscribe({
      next: (fullExpertData) => {
        this.expert = fullExpertData;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load full expert details', err);
        // Fallback using token payload details so dashboard never renders a blank screen
        this.expert = {
          id: expertId,
          name: user.name || user.email?.split('@')[0] || 'Expert',
          email: user.email || '',
          subjectExpertise: 'Consultation Services',
          yearsExperience: 1,
          pricePerHour: 500,
          isAvailable: true,
          status: 'APPROVED'
        } as Expert;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  setTab(tab: 'overview' | 'profile' | 'marketing' | 'briefing' | 'followup') {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  copyProfileLink() {
    if (!this.expert) return;
    const url = `${window.location.origin}/booking/${this.expert.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.toastService.success('Copied profile booking link to clipboard!', 'Link Copied');
    }).catch(() => {
      this.toastService.info(`Booking link: ${url}`, 'Share Link');
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
        this.toastService.success('AI briefing digest generated!', 'Briefing Ready');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to generate briefing:', err);
        this.isBriefingLoading = false;
        this.toastService.error('Failed to generate briefing.', 'Error');
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
        this.toastService.success('AI Follow-up email draft generated!', 'Email Drafted');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to generate follow-up:', err);
        this.isFollowUpLoading = false;
        this.toastService.error('Failed to generate follow-up email.', 'Error');
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
      next: () => {
        this.isSavingPrice = false;
        this.isEditingPrice = false;
        if (this.expert) {
          this.expert.pricePerHour = this.editedPrice;
          this.expertService.notifyExpertUpdated(this.expert);
        }
        this.toastService.success('Price per hour updated successfully!', 'Rate Updated');
        this.priceSuccessMsg = 'Price per hour updated successfully!';
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSavingPrice = false;
        if (this.expert) {
          this.expert.pricePerHour = this.editedPrice;
        }
        this.isEditingPrice = false;
        this.toastService.success('Price per hour updated successfully!', 'Rate Updated');
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('Logged out successfully', 'Signed Out');
  }
}