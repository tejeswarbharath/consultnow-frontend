import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { Expert, ExpertService } from '../../services/expert.service';

@Component({
  selector: 'app-expert-marketing-tool',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expert-marketing-tool.html'
})
export class ExpertMarketingTool {
  @Input() expert!: Expert;
  
  // FIX: This explicit EventEmitter tells Angular that $event is an 'Expert' object, not a DOM event.
  @Output() profileUpdated = new EventEmitter<Expert>(); 

  private aiService = inject(AiService);
  private expertService = inject(ExpertService);

  skillsInput: string = '';
  isLoading = false;
  isSaving = false;
  error = '';
  successMessage = '';
  marketingData: any = null;

  // Pricing Advisor properties
  pricingData: { recommendedPrice: number; priceRange: string; rationale: string } | null = null;
  isPricingLoading = false;

  generateMarketing() {
    if (!this.skillsInput.trim()) return;

    this.isLoading = true;
    this.error = '';
    this.successMessage = '';
    this.marketingData = null;

    this.aiService.generateMarketingContent(this.skillsInput).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.marketingData = {
          bio: response.bio || response.professionalBio,
          marketingSnippet: response.marketingSnippet || response.serviceDescription
        };
      },
      error: (err) => {
        this.isLoading = false;
        console.error('AI Generation Failed:', err);
        this.error = 'Failed to generate content. Please try again.';
      }
    });
  }

  saveToProfile() {
    if (!this.marketingData) return;

    this.isSaving = true;
    this.error = '';
    this.successMessage = '';

    const updatedExpert = {
      ...this.expert,
      bio: this.marketingData.bio,
      marketingSnippet: this.marketingData.marketingSnippet
    };

    this.expertService.updateExpert(this.expert.id, {
      bio: this.marketingData.bio,
      marketingSnippet: this.marketingData.marketingSnippet
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Update generic listeners
        this.expertService.notifyExpertUpdated(updatedExpert);
        
        // FIX: Emit the newly saved profile back up to the parent component
        this.profileUpdated.emit(updatedExpert); 
        
        this.marketingData = null;
        this.skillsInput = '';
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Save Failed:', err);
        this.error = 'Failed to save to profile. Please try again.';
      }
    });
  }

  getPricingRecommendation() {
    if (!this.expert) return;
    this.isPricingLoading = true;
    this.pricingData = null;

    this.aiService.recommendPricing(
      this.expert.yearsExperience || 2,
      this.expert.subjectExpertise || '',
      this.expert.pricePerHour || 1000
    ).subscribe({
      next: (res) => {
        this.pricingData = res;
        this.isPricingLoading = false;
      },
      error: (err) => {
        console.error('Pricing Advisor Failed:', err);
        this.isPricingLoading = false;
      }
    });
  }
}