import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Expert, ExpertService } from '../../services/expert.service';
import { AiSupportChatComponent } from '../ai-support-chat/ai-support-chat.component';
import { environment } from '../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { Title, Meta } from '@angular/platform-browser';
import { ToastService } from '../../services/toast.service';

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
    'IT Career Guidance': 'Empowers early-career professionals and career-transitioning candidates with strategic roadmaps, upskilling advice, and mentorship to navigate the rapidly evolving technology industry.',
    'HR Services': 'Assists organizations and business founders in designing effective workplace policies, and implementing modern human resources best practices.'
  };

  // Quick Prompt Chips
  promptChips = [
    { label: '✨ Resume Review', prompt: 'I need guidance on reviewing my software engineering resume for tech roles.' },
    { label: '💻 System Architecture', prompt: 'I need an expert consultation on scalable cloud microservices design.' },
    { label: '👔 Remote HR Policy', prompt: 'Help me draft a comprehensive remote work and attendance policy.' },
    { label: '📚 Math & Physics Tutoring', prompt: 'Looking for a private tutor for high school algebra and physics.' }
  ];

  constructor(
    private expertService: ExpertService,
    private aiService: AiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private metaService: Meta,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.loading = true;

    // Set SEO Meta Tags
    this.titleService.setTitle('ConsultNow - Connect with Professional Experts for HR, IT & Tutoring');
    this.metaService.updateTag({
      name: 'description',
      content: 'ConsultNow connects you with professional experts in IT Career Guidance, HR Services, and Student Tutoring. Book a session or chat with an AI twin.'
    });

    if (isPlatformBrowser(this.platformId)) {
      this.expertService.getExpertsGroupedBySubject().subscribe({
        next: (data) => {
          setTimeout(() => {
            this.expertsBySubject = data;
            this.subjects = Object.keys(data);
            if (this.subjects.length > 0) {
              this.openSubject = this.subjects[0]; // Open first category by default for scannability
            }
            this.loading = false;
            this.cdr.detectChanges(); 
          });
        },
        error: (err) => {
          setTimeout(() => {
            console.error('Failed to load experts', err);
            this.loading = false;
            this.cdr.detectChanges(); 
          });
        }
      });

      // Listen to category filters from support chatbot
      this.expertService.categoryFilter$.subscribe((category) => {
        if (category) {
          this.activeFilterCategory = category;
          this.openSubject = category;
        } else {
          this.activeFilterCategory = null;
        }
        this.cdr.detectChanges();
      });
    }
  }

  applyPromptChip(promptText: string): void {
    this.searchQuery = promptText;
    this.toastService.info('Matching prompt with AI expert routing...', 'AI Matcher');
    this.searchWithAi();
  }

  filterByCategoryPill(category: string | null): void {
    this.activeFilterCategory = category;
    if (category) {
      this.openSubject = category;
      this.toastService.info(`Filtered by category: ${category}`, 'Category Selected');
    } else {
      this.openSubject = this.subjects[0] || null;
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
          this.toastService.success(`AI matched your problem to: ${category}`, 'Match Found');

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
    if (this.subjects.length > 0) {
      this.openSubject = this.subjects[0];
    }
    this.cdr.detectChanges();
  }

  toggleSubject(subject: string): void {
    this.openSubject = this.openSubject === subject ? null : subject;
  }

  selectExpert(expert: Expert): void {
    this.router.navigate(['/booking', expert.id]);
  }
}