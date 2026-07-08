import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Expert, ExpertService } from '../../services/expert.service';
import { AiSupportChatComponent } from '../ai-support-chat/ai-support-chat.component';
import { environment } from '../../../environments/environment';
import { CommonModule, isPlatformServer } from '@angular/common';
import { AiService } from '../../services/ai.service';

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
  registerUrl: string = environment.registerUrl;

  // AI-Powered search features variables
  searchQuery: string = '';
  searchLoading: boolean = false;
  activeFilterCategory: string | null = null;
  emergencyDisclaimer: string | null = null;
  expertRecommendations: { [expertId: string]: string } = {};

  categoryDescriptions: { [key: string]: string } = {
    'Student Tutoring Services': 'Connects young learners from Grades 1 through 10 with experienced educators to provide personalized academic support, homework assistance, and foundational skill-building.',
    'Medical Advice': 'Provides users with general health information, wellness insights, and non-emergency guidance from verified healthcare professionals across various medical specialties.',
    'IT Career Guidance': 'Empowers early-career professionals and career-transitioning candidates with strategic roadmaps, upskilling advice, and mentorship to navigate the rapidly evolving technology industry.',
    'Legal Advice': 'Connects individuals with qualified legal professionals to provide general guidance, clarify rights and procedures, and help users understand the legal frameworks surrounding their current challenges.',
    'HR Services': 'Assists organizations and business founders in designing effective workplace policies, navigating manpower disputes, and implementing modern human resources best practices.'
  };

  constructor(
    private expertService: ExpertService,
    private aiService: AiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.loading = true;

    if (isPlatformServer(this.platformId)) {
      this.loading = false;
    } else {
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

      // Listen to category filters from support chatbot
      this.expertService.categoryFilter$.subscribe((category) => {
        if (category) {
          this.activeFilterCategory = category;
          this.openSubject = category;
        } else {
          this.activeFilterCategory = null;
          this.openSubject = null;
        }
        this.cdr.detectChanges();
      });
    }
  }

  searchWithAi(): void {
    if (!this.searchQuery.trim()) return;

    this.searchLoading = true;
    this.emergencyDisclaimer = null;
    this.expertRecommendations = {};
    this.cdr.detectChanges();

    this.aiService.triageProblem(this.searchQuery).subscribe({
      next: (res) => {
        this.searchLoading = false;
        
        if (res.isEmergency) {
          this.emergencyDisclaimer = res.disclaimer || 'Emergency warning triggered. Please seek immediate professional assistance.';
          this.cdr.detectChanges();
          return;
        }

        const category = res.recommendedCategory;
        if (category && this.subjects.includes(category)) {
          this.activeFilterCategory = category;
          this.openSubject = category;

          // Fetch LLM summaries for experts in this category
          const experts = this.expertsBySubject[category] || [];
          if (experts.length > 0) {
            this.aiService.getExpertSummaries(this.searchQuery, experts).subscribe({
              next: (sumRes) => {
                this.expertRecommendations = sumRes.summaries || {};
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Failed to get expert recommendations', err);
                this.cdr.detectChanges();
              }
            });
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('AI search failed', err);
        this.searchLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearSearchFilter(): void {
    this.searchQuery = '';
    this.activeFilterCategory = null;
    this.expertRecommendations = {};
    this.emergencyDisclaimer = null;
    this.openSubject = null;
    this.cdr.detectChanges();
  }

  toggleSubject(subject: string): void {
    this.openSubject = this.openSubject === subject ? null : subject;
  }

  selectExpert(expert: Expert): void {
    this.router.navigate(['/booking', expert.id]);
  }
}