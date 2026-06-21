import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpertService, Expert } from '../../services/expert.service';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private expertService = inject(ExpertService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  expertId: string | null = null;
  expert: Expert | null = null;
  isLoading = true;

  // Guest Information mapping to Guest Architecture Pivot
  guestName = '';
  guestEmail = '';
  problemDescription = '';
  isProcessing = false;

  ngOnInit() {
    this.expertId = this.route.snapshot.paramMap.get('id');
    if (this.expertId) {
      this.fetchExpertDetails();
    } else {
      this.router.navigate(['/']); // Redirect if accessed without ID
    }
  }

  fetchExpertDetails() {
    this.expertService.getExpertById(this.expertId!).subscribe({
      next: (data) => {
        this.expert = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load expert details', err);
        this.isLoading = false;
        this.router.navigate(['/']); 
      }
    });
  }

  initiateCheckout() {
    if (!this.guestName || !this.guestEmail) {
      alert('Please provide your name and email so we can send the consultation link.');
      return;
    }

    if (!this.expert) return;

    this.isProcessing = true;

    // We pass the dynamic currency set by the Expert in Phase 2
    const paymentPayload = {
      expertId: this.expert.id,
      amount: this.expert.pricePerHour,
      currency: this.expert.currency || 'INR', 
      guestData: {
        name: this.guestName,
        email: this.guestEmail,
        problem: this.problemDescription
      }
    };

    // Initiate Razorpay Order Context
    this.paymentService.createOrder(paymentPayload).subscribe({
      next: (orderData: any) => {
        this.isProcessing = false;
        // Opens the Razorpay modal configured for either INR or USD
        this.paymentService.openRazorpayModal(orderData, this.guestName, this.guestEmail);
      },
      error: (err) => {
        console.error('Failed to initialize secure checkout session', err);
        this.isProcessing = false;
        alert('Payment initialization failed. Please try again.');
      }
    });
  }
}