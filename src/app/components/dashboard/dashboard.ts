import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Expert, ExpertService } from '../../services/expert.service';
import { ExpertMarketingTool } from '../expert-marketing-tool/expert-marketing-tool';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // REQUIRED: This was missing!
  imports: [CommonModule, ExpertMarketingTool],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private expertService = inject(ExpertService);
  private authService = inject(AuthService); // Inject Auth to get the token
  private cdr = inject(ChangeDetectorRef);
  
  expert: Expert | null = null;
  isLoading = true;

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
}