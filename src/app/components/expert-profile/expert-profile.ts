import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Expert, ExpertService } from '../../services/expert.service';
import { ExpertMarketingTool } from '../expert-marketing-tool/expert-marketing-tool';

@Component({
  selector: 'app-expert-profile',
  standalone: true,
  imports: [CommonModule, ExpertMarketingTool],
  templateUrl: './expert-profile.html',
  styleUrl: './expert-profile.scss'
})
export class ExpertProfile implements OnInit {
  expert: Expert | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private expertService: ExpertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const expertId = this.route.snapshot.paramMap.get('id');
    if (expertId) {
      this.expertService.getExpertById(expertId).subscribe({
        next: (data) => {
          this.expert = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load expert profile', err);
          this.error = 'Failed to load expert profile details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Expert ID not found in URL.';
      this.loading = false;
    }
  }

  handleProfileUpdate(updatedExpert: Expert): void {
    this.expert = updatedExpert;
  }
}
