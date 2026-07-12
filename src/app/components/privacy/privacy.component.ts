import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[var(--b1)] py-12 px-4 sm:px-6 lg:px-8 text-[var(--bc)]">
      <div class="max-w-3xl mx-auto bg-[var(--b2)] border border-[var(--b3)] p-8 rounded-2xl shadow-2xl">
        <h1 class="text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
        <p class="text-xs text-[var(--bc)]/60 mb-6">Last updated: July 12, 2026</p>
        
        <div class="space-y-6 text-sm leading-relaxed">
          <p>At ConsultNow ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share information when you use our platform at consultnow.in.</p>

          <h2 class="text-xl font-bold text-white mt-8">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when booking consultations or registering as an expert, including:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Contact Information</strong>: Name, email address, and phone number.</li>
            <li><strong>Profile Information</strong>: Professional biography, profile pictures, and expertise fields (for experts).</li>
            <li><strong>Consultation Details</strong>: Subject matter and problem descriptions provided during booking.</li>
          </ul>

          <h2 class="text-xl font-bold text-white mt-8">2. Google OAuth and Calendar Data Integration</h2>
          <p>Our application integrates with Google Calendar API services to automate booking flows. When you authorize our application via Google OAuth, we access:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Google Calendar Events</strong>: We write and update calendar invites, attendee lists, and generate secure Google Meet video conference links for scheduled consultations.</li>
          </ul>
          
          <div class="bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded-r-xl my-4 text-xs">
            <strong>Google API Limited Use Disclosure:</strong><br>
            ConsultNow's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" class="text-blue-400 hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements. We do not share, sell, or transfer your Google Calendar data to any third-party advertising or marketing services.
          </div>

          <h2 class="text-xl font-bold text-white mt-8">3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>To schedule, manage, and coordinate consultation appointments.</li>
            <li>To automatically send Google Calendar invites and email confirmations to clients and experts.</li>
            <li>To process payments securely.</li>
          </ul>

          <h2 class="text-xl font-bold text-white mt-8">4. Data Sharing and Third Parties</h2>
          <p>We only share data with third parties necessary to operate our service, including database hosts, payment processing gateways (Razorpay), and calendar synchronization (Google Calendar). We never sell your personal information.</p>

          <h2 class="text-xl font-bold text-white mt-8">5. Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy or your data, please contact us at:</p>
          <p>Email: <a href="mailto:support@consultnow.in" class="text-blue-400 hover:underline">support@consultnow.in</a></p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
