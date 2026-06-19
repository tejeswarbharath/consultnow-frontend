import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Category, Expert, ExpertService } from '../../services/expert.service';
import { PaymentService } from '../../services/payment.service';
import { AiSupportChat } from '../ai-support-chat/ai-support-chat';

// Declare Razorpay to avoid TS errors
declare var Razorpay: any;

@Component({
  selector: 'app-expert-discovery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AiSupportChat],
  templateUrl: './expert-discovery.component.html',
  styles: ``
})
export class ExpertDiscoveryComponent implements OnInit {
  experts: Expert[] = [];
  categories: Category[] = [];
  
  selectedCategoryId: string = '';
  searchQuery: string = '';
  loading: boolean = false;

  constructor(
    private expertService: ExpertService,
    private paymentService: PaymentService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.expertService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loadExperts(); // Now load experts after categories are fetched
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.loading = false;
      }
    });
    await this.paymentService.loadRazorpayScript();
  }

  loadExperts(): void {
    const emptyCategories = ['Student Tutoring Services', 'Medical Advice', 'IT Career Guidance', 'Legal Advice', 'HR Services'];
    const categoryName = this.categories.find(c => c.id === this.selectedCategoryId)?.name;
    
    if (categoryName && emptyCategories.includes(categoryName)) {
      this.experts = [];
      setTimeout(() => this.loading = false, 0);
      return;
    }

    this.loading = true;
    // We need to trigger change detection manually here because we set loading to true
    // and it might be updated in the same cycle by the synchronous part of the code above.
    this.cdRef.detectChanges();

    this.expertService.getExperts(this.selectedCategoryId, this.searchQuery).subscribe({
      next: (data) => {
        this.experts = data;
        // Defer the loading state change to the next macrotask
        setTimeout(() => this.loading = false, 0);
      },
      error: (err) => {
        console.error('Failed to load experts', err);
        setTimeout(() => this.loading = false, 0);
      }
    });
  }

  onSearch(): void {
    this.loadExperts();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.loadExperts(); 
  }

  selectExpertAndPay(expert: Expert): void {
    this.paymentService.createOrder(expert.id).subscribe({
      next: (order) => {
        const options = {
          key: environment.razorpayKeyId,
          amount: order.amount,
          currency: order.currency,
          name: 'ConsultNow',
          description: `Consultation with ${expert.name}`,
          order_id: order.id,
          handler: (response: any) => {
            this.paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }).subscribe({
              next: (verificationResult) => {
                if (verificationResult.success) {
                  this.router.navigate(['/payment-success'], { queryParams: { reference_id: response.razorpay_payment_id } });
                } else {
                  this.router.navigate(['/payment-failure'], { queryParams: { reference_id: response.razorpay_order_id } });
                }
              },
              error: () => {
                this.router.navigate(['/payment-failure'], { queryParams: { reference_id: response.razorpay_order_id } });
              }
            });
          },
          prefill: {
            name: 'User',
            email: 'user@example.com'
          },
          theme: {
            color: '#2563eb'
          }
        };
        
        const rzp = new Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          this.router.navigate(['/payment-failure'], { queryParams: { reference_id: response.error.metadata.order_id } });
        });
        rzp.open();
      },
      error: (err) => {
        console.error('Error creating order', err);
        alert('Failed to initiate checkout. Please try again.');
      }
    });
  }
}
