import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpertService, Expert } from '../../services/expert.service';
import { PaymentService } from '../../services/payment.service';
import { BookingService } from '../../services/booking.service';
import { AiService } from '../../services/ai.service';
import { Title, Meta } from '@angular/platform-browser';

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
  private platformId = inject(PLATFORM_ID);
  private aiService = inject(AiService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  expertId: string | null = null;
  expert: Expert | null = null;
  isLoading = true;

  // Sandbox Chat variables
  showSandbox = false;
  sandboxHistory: { sender: 'user' | 'ai'; text: string }[] = [];
  sandboxInput = '';
  sandboxLoading = false;
  // Guest Information
  guestName = '';
  guestEmail = '';
  problemDescription = '';
  isProcessingPaid = false;
  isProcessingFree = false;
  disclaimerAccepted = false;

  // Custom confirmation and alert modal state
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalType: 'info' | 'confirm' = 'info';
  confirmAction: (() => void) | null = null;

  // Flexible tutoring hours variables
  hoursCount = 1;
  totalAmount = 0;

  // Availability
  availableSlots: Date[] = [];
  selectedSlot: Date | null = null;
  currentPage = 1;
  pageSize = 20;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.expertId = this.route.snapshot.paramMap.get('id');
      if (this.expertId) {
        this.fetchExpertDetails();
      } else {
        this.router.navigate(['/']); // Redirect if accessed without an ID
      }
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
        setTimeout(() => {
          this.expert = data;
          this.isLoading = false;
          this.updateTotalAmount();
          this.fetchAvailability();
          this.updateSEOMetadata();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Failed to load expert details', err);
          this.isLoading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/']);
        });
      }
    });
  }

  updateSEOMetadata() {
    if (!this.expert) return;

    // 1. Dynamic Page Title
    const pageTitle = `Book Consultation with ${this.expert.name} | ConsultNow`;
    this.titleService.setTitle(pageTitle);

    // 2. Dynamic Meta Description
    const description = `Book a 1-hour session with ${this.expert.name}, an expert specializing in ${this.expert.subjectExpertise}. ${this.expert.marketingSnippet || this.expert.bio || ''}`.substring(0, 160);
    this.metaService.updateTag({ name: 'description', content: description });

    // 3. Dynamic JSON-LD Structured Data Schema
    try {
      const scriptId = 'expert-jsonld-schema';
      let scriptElement = this.document.getElementById(scriptId) as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = this.document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'application/ld+json';
        this.document.body.appendChild(scriptElement);
      }

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        'name': this.expert.name,
        'description': this.expert.marketingSnippet || this.expert.bio || `Expert consultant in ${this.expert.subjectExpertise}`,
        'image': this.expert.photoUrl || 'https://consultnow.in/Expert_Profile_No_Photo.png',
        'priceRange': `₹${this.expert.pricePerHour}`,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'IN'
        }
      };

      scriptElement.text = JSON.stringify(schema);
    } catch (e) {
      console.error('Error generating JSON-LD structured data', e);
    }
  }

  updateTotalAmount() {
    if (this.hoursCount < 1) {
      this.hoursCount = 1;
    }
    if (this.expert) {
      this.totalAmount = this.expert.pricePerHour * this.hoursCount;
    }
    this.cdr.detectChanges();
  }

  fetchAvailability() {
    this.bookingService.getAvailability(this.expertId!).subscribe({
      next: (slots) => {
        setTimeout(() => {
          this.availableSlots = slots.map(s => new Date(s));
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Failed to load availability', err);
          this.cdr.detectChanges();
        });
      }
    });
  }

  selectSlot(slot: Date) {
    this.selectedSlot = slot;
    this.cdr.detectChanges();
  }

  showModal(title: string, message: string, type: 'info' | 'confirm' = 'info', onConfirm?: () => void) {
    this.confirmModalTitle = title;
    this.confirmModalMessage = message;
    this.confirmModalType = type;
    this.confirmAction = onConfirm || null;
    this.showConfirmModal = true;
    this.cdr.detectChanges();
  }

  handleModalOkay() {
    this.showConfirmModal = false;
    if (this.confirmAction) {
      const action = this.confirmAction;
      this.confirmAction = null;
      action();
    }
    this.cdr.detectChanges();
  }

  handleModalCancel() {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.cdr.detectChanges();
  }

  initiateCheckout() {
    if (!this.guestName || !this.guestEmail || !this.problemDescription) {
      this.showModal('Details Required', 'Please provide your name, email, and your first query so we can prepare your consultation.');
      return;
    }

    if (!this.selectedSlot) {
      this.showModal('Select Slot', 'Please select a time slot for your consultation.');
      return;
    }

    if (!this.disclaimerAccepted) {
      this.showModal('Agreement Required', 'You must read and agree to the disclaimers and guidelines for this category before booking.');
      return;
    }

    if (this.hoursCount < 1) {
      this.showModal('Invalid Hours', 'Please enter a valid number of hours (minimum 1).');
      return;
    }
    
    const formattedDate = this.selectedSlot.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' });
    this.showModal(
      'Confirm Paid Booking',
      `Are you sure you want to book a paid consultation with ${this.expert?.name || 'this expert'} on ${formattedDate} for ${this.hoursCount} hour(s)? The total payable is ₹${this.totalAmount}.`,
      'confirm',
      () => {
        this.proceedWithPaidBooking();
      }
    );
  }

  proceedWithPaidBooking() {
    this.isProcessingPaid = true;
    this.cdr.detectChanges();

    const paymentPayload = {
      expertId: this.expertId!,
      amount: this.totalAmount,
      currency: this.expert!.currency || 'INR',
      guestData: {
        name: this.guestName,
        email: this.guestEmail,
        problem: this.problemDescription
      }
    };

    this.paymentService.createOrder(paymentPayload).subscribe({
      next: (orderData: any) => {
        this.paymentService.openRazorpayModal(orderData, this.guestName, this.guestEmail, this.selectedSlot, this.hoursCount).then(() => {
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
        this.showModal('Payment Initialization Failed', 'Failed to initialize payment. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  bookFreeService() {
    if (!this.guestName || !this.guestEmail || !this.problemDescription) {
      this.showModal('Details Required', 'Please provide your name, email, and your first query before proceeding.');
      return;
    }

    if (!this.selectedSlot) {
      this.showModal('Select Slot', 'Please select a time slot for your consultation.');
      return;
    }

    if (!this.disclaimerAccepted) {
      this.showModal('Agreement Required', 'You must read and agree to the disclaimers and guidelines for this category before booking.');
      return;
    }

    const formattedDate = this.selectedSlot.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' });
    this.showModal(
      'Confirm Free Consultation',
      `Are you sure you want to request a free 1-hour consultation with ${this.expert?.name || 'this expert'} on ${formattedDate}?`,
      'confirm',
      () => {
        this.proceedWithFreeBooking();
      }
    );
  }

  proceedWithFreeBooking() {
    this.isProcessingFree = true;
    this.cdr.detectChanges();

    const endTime = new Date(this.selectedSlot!);
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
        this.showModal(
          'Booking Request Sent',
          'Your 1-hour free service request has been sent! Check your email for confirmation.',
          'info',
          () => {
            this.router.navigate(['/']);
          }
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isProcessingFree = false;
        console.error('Free service booking failed', err);
        this.showModal('Booking Failed', 'Failed to book free service. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  toggleSandbox() {
    this.showSandbox = !this.showSandbox;
    if (this.showSandbox && this.sandboxHistory.length === 0 && this.expert) {
      this.sandboxHistory.push({
        sender: 'ai',
        text: `Hello! I am the AI Twin of ${this.expert.name}. You can chat with me for free to practice our session, ask questions, or clarify your thoughts. How can I help you today?`
      });
    }
    this.cdr.detectChanges();
  }

  sendSandboxMessage() {
    if (!this.sandboxInput.trim() || !this.expertId) return;

    const userMessage = this.sandboxInput;
    this.sandboxHistory.push({ sender: 'user', text: userMessage });
    this.sandboxInput = '';
    this.sandboxLoading = true;
    this.cdr.detectChanges();

    this.aiService.chatWithExpertTwin(this.expertId, userMessage, this.sandboxHistory.slice(0, -1)).subscribe({
      next: (res) => {
        this.sandboxHistory.push({ sender: 'ai', text: res.reply });
        this.sandboxLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to chat with AI Twin:', err);
        this.sandboxHistory.push({
          sender: 'ai',
          text: 'Oops, I encountered an issue. Let me know if you want to try again, or feel free to book a live session!'
        });
        this.sandboxLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectSandboxPrompt(promptText: string) {
    this.sandboxInput = promptText;
    this.sendSandboxMessage();
  }
}