import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpertService, Expert } from '../../services/expert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-expert-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expert-profile.html',
  styleUrl: './expert-profile.scss'
})
export class ExpertProfile implements OnInit {
  expert: Expert | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private expertService: ExpertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.expertService.getExpertById(user.id).subscribe({
        next: (data) => {
          this.expert = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load expert profile', err);
          this.error = 'Failed to load profile details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'User not found.';
      this.loading = false;
    }
  }
}
