import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[var(--b1)] py-12 px-4 sm:px-6 lg:px-8 text-[var(--bc)]">
      <div class="max-w-3xl mx-auto bg-[var(--b2)] border border-[var(--b3)] p-8 rounded-2xl shadow-2xl">
        <h1 class="text-3xl font-extrabold text-white mb-2">Terms of Service</h1>
        <p class="text-xs text-[var(--bc)]/60 mb-6">Last updated: July 12, 2026</p>
        
        <div class="space-y-6 text-sm leading-relaxed">
          <p>Welcome to ConsultNow. By accessing or using our website and services at consultnow.in, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.</p>

          <h2 class="text-xl font-bold text-white mt-8">1. Description of Service</h2>
          <p>ConsultNow is a platform connecting users seeking professional consultation with certified experts. We provide booking, payment facilitation, and automated calendar/meeting link generation utilities.</p>

          <h2 class="text-xl font-bold text-white mt-8">2. User Accounts and Bookings</h2>
          <ul class="list-disc pl-5 space-y-1">
            <li>You must provide accurate, current, and complete information during registration and booking.</li>
            <li>Appointments booked through the platform represent an agreement between the user and the selected expert.</li>
          </ul>

          <h2 class="text-xl font-bold text-white mt-8">3. Third-Party Integrations (Google Calendar)</h2>
          <p>To enable automated scheduling and video conferencing, ConsultNow utilizes integration with Google Calendar API. By linking your Google account, you agree to allow ConsultNow to create and modify calendar events on your behalf to coordinate sessions.</p>

          <h2 class="text-xl font-bold text-white mt-8">4. Fees and Payments</h2>
          <p>Paid consultations are processed securely via our payment gateway partner, Razorpay. All fees are clearly disclosed prior to booking. Refunds and cancellations are subject to the individual expert's profile policy.</p>

          <h2 class="text-xl font-bold text-white mt-8">5. Limitation of Liability</h2>
          <p>ConsultNow acts as an intermediary scheduling platform and is not responsible for the advice, actions, or conduct of any experts or users during consultations.</p>

          <h2 class="text-xl font-bold text-white mt-8">6. Contact Us</h2>
          <p>If you have any questions regarding these Terms, please contact us at:</p>
          <p>Email: <a href="mailto:support@consultnow.in" class="text-blue-400 hover:underline">support@consultnow.in</a></p>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}
