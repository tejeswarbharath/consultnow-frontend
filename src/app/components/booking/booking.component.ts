import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpertService, Expert } from '../../services/expert.service';
import { PaymentService } from '../../services/payment.service';
import { BookingService } from '../../services/booking.service';

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
  private bookingService = inject(BookingService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  expertId: string | null = null;
  expert: Expert | null = null;
  isLoading = true;

  // Guest Information
  guestName = '';
  guestEmail = '';
  problemDescription = '';
  isProcessingPaid = false;
  isProcessingFree = false;

  // Availability
  availableSlots: Date[] = [];
  selectedSlot: Date | null = null;
  currentPage = 1;
  pageSize = 20;

  ngOnInit() {
    this.expertId = this.route.snapshot.paramMap.get('id');
    if (this.expertId) {
      this.fetchExpertDetails();
    } else {
      this.router.navigate(['/']); // Redirect if accessed without an ID
    }
  }

  get paginatedSlots(): Date[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.availableSlots.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.availableSlots.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  fetchExpertDetails() {
    this.expertService.getExpertById(this.expertId!).subscribe({
      next: (data) => {
        this.expert = data;
        this.isLoading = false;
        this.fetchAvailability();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load expert details', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/']);
      }
    });
  }

  fetchAvailability() {
    this.bookingService.getAvailability(this.expertId!).subscribe({
      next: (slots) => {
        this.availableSlots = slots.map(s => new Date(s));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load availability', err);
      }
    });
  }

  selectSlot(slot: Date) {
    this.selectedSlot = slot;
    this.cdr.detectChanges();
  }

  initiateCheckout() {
    if (!this.guestName || !this.guestEmail || !this.problemDescription) {
      alert('Please provide your name, email, and your first query so we can prepare your consultation.');
      return;
    }

    if (!this.selectedSlot) {
      alert('Please select a time slot for your consultation.');
      return;
    }
    
    this.isProcessingPaid = true;

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
        this.paymentService.openRazorpayModal(orderData, this.guestName, this.guestEmail, this.selectedSlot).then(() => {
           this.isProcessingPaid = false;
           this.cdr.detectChanges();
        }).catch(() => {
           this.isProcessingPaid = false;
           this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Order creation failed', err);
        this.isProcessingPaid = false;
        alert('Failed to initialize payment. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  bookFreeService() {
    if (!this.guestName || !this.guestEmail || !this.problemDescription) {
      alert('Please provide your name, email, and your first query before proceeding.');
      return;
    }

    if (!this.selectedSlot) {
      alert('Please select a time slot for your consultation.');
      return;
    }

    this.isProcessingFree = true;
    this.cdr.detectChanges();

    const endTime = new Date(this.selectedSlot);
    endTime.setHours(endTime.getHours() + 1);

    const payload = {
      expertId: this.expertId,
      serviceDetails: this.problemDescription,
      startTime: this.selectedSlot,
      endTime: endTime,
      guestData: {
        name: this.guestName,
        email: this.guestEmail
      }
    };

    this.bookingService.requestFreeService(payload).subscribe({
      next: () => {
        this.isProcessingFree = false;
        alert('Your 1-hour free service request has been sent! Check your email for confirmation.');
        this.router.navigate(['/']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isProcessingFree = false;
        console.error('Free service booking failed', err);
        alert('Failed to book free service. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }
}