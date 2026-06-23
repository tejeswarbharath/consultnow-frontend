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
      this.router.navigate(['/']); // Redirect if accessed without an ID
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
    if (!this.guestName || !this.guestEmail || !this.problemDescription) {
      alert('Please provide your name, email, and your first query so we can prepare your consultation.');
      return;
    }
    
    this.isProcessing = true;

    const paymentPayload = {
      expertId: this.expertId!,
      amount: this.expert!.pricePerHour,
      currency: this.expert!.currency || 'INR',
      guestData: {
        name: this.guestName,
        email: this.guestEmail,
        problem: this.problemDescription
      }
    };

    this.paymentService.createOrder(paymentPayload).subscribe({
      next: (orderData: any) => {
        this.paymentService.openRazorpayModal(orderData, this.guestName, this.guestEmail).then(() => {
           this.isProcessing = false;
        }).catch(() => {
           this.isProcessing = false;
        });
      },
      error: (err: any) => {
        console.error('Order creation failed', err);
        this.isProcessing = false;
        alert('Failed to initialize payment. Please try again.');
      }
    });
  }

  bookFreeService() {
    if (!this.guestName || !this.guestEmail || !this.problemDescription) {
      alert('Please provide your name, email, and your first query before proceeding.');
      return;
    }

    this.isProcessing = true;

    // Simulating a successful free booking workflow dispatch for now
    setTimeout(() => {
      this.isProcessing = false;
      alert('Your 1-hour free service request has been sent! Check your email for the Google Meet link.');
      this.router.navigate(['/']); 
    }, 1500);
  }
}