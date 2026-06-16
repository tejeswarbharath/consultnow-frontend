import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ExpertService, Expert, Category } from '../../services/expert.service';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environments/environment';

// Declare Razorpay to avoid TS errors
declare var Razorpay: any;

@Component({
  selector: 'app-expert-discovery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadCategories();
    this.loadExperts();
    await this.paymentService.loadRazorpayScript();
  }

  loadCategories(): void {
    this.expertService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadExperts(): void {
    this.loading = true;
    this.expertService.getExperts(this.selectedCategoryId, this.searchQuery).subscribe({
      next: (data) => {
        this.experts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load experts', err);
        this.loading = false;
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
