import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Expert, ExpertService } from '../../services/expert.service';
import { ExpertMarketingTool } from '../expert-marketing-tool/expert-marketing-tool';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ExpertMarketingTool],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private expertService = inject(ExpertService);
  
  expert: Expert | null = null;
  isLoading = true;

  ngOnInit() {
    const storedExpert = localStorage.getItem('expert');
    if (storedExpert) {
      const parsedExpert = JSON.parse(storedExpert);
      
      this.expertService.getExpertById(parsedExpert.id).subscribe({
        next: (fullExpertData) => {
          this.expert = fullExpertData;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load full expert details', err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }

    this.expertService.expertUpdated$.subscribe((updatedExpert: Expert) => {
      this.expert = updatedExpert;
    });
  }
}
