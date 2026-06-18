import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ExpertService } from '../../services/expert.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expert-marketing-tool',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expert-marketing-tool.html',
  styleUrl: './expert-marketing-tool.scss'
})
export class ExpertMarketingTool {
  skillsInput: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  error: string | null = null;
  marketingData: any = null;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private expertService: ExpertService,
    private router: Router
  ) {}

  generateMarketing() {
    if (!this.skillsInput.trim()) {
      this.error = 'Please enter some skills.';
      return;
    }

    this.isLoading = true;
    this.error = null;
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
    const updateData = {
      bio: this.marketingData.bio || this.marketingData.professionalBio,
      marketingSnippet: this.marketingData.marketingSnippet || this.marketingData.serviceDescription
    };

    this.expertService.updateExpert(user.id, updateData).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/expert-profile']);
      },
      error: (err) => {
        console.error('Failed to save profile', err);
        this.error = 'Failed to save profile. Please try again.';
        this.isSaving = false;
      }
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Show a brief "Copied!" notification
    });
  }
}
