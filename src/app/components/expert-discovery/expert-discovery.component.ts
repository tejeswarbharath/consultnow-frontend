import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Expert, ExpertService } from '../../services/expert.service';
import { AiSupportChatComponent } from '../ai-support-chat/ai-support-chat.component';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-discovery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AiSupportChatComponent],
  templateUrl: './expert-discovery.component.html',
  styles: [`
    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }
  `]
})
export class ExpertDiscoveryComponent implements OnInit {
  expertsBySubject: {[key: string]: Expert[]} = {};
  subjects: string[] = [];
  
  loading: boolean = true; 
  openSubject: string | null = null;
  showBanner = false;
  registerUrl: string = environment.registerUrl;

  constructor(
    private expertService: ExpertService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined' && !localStorage.getItem('hideExpertBanner')) {
      this.showBanner = true;
    }

    this.loading = true;
    this.expertService.getExpertsGroupedBySubject().subscribe({
      next: (data) => {
        this.expertsBySubject = data;
        this.subjects = Object.keys(data);
        this.loading = false;
        
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Failed to load experts', err);
        this.loading = false;
        
        this.cdr.detectChanges(); 
      }
    });
  }

  dismissBanner(): void {
    this.showBanner = false;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('hideExpertBanner', 'true');
    }
  }

  toggleSubject(subject: string): void {
    this.openSubject = this.openSubject === subject ? null : subject;
  }

  selectExpert(expert: Expert): void {
    // Navigate to the booking/checkout interface
    this.router.navigate(['/booking', expert.id]);
  }
}