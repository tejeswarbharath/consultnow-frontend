import { Component } from '@angular/core';

@Component({
  selector: 'app-booking',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900">Booking & Checkout</h1>
        <p class="text-gray-600 mt-4">This is the booking and checkout page. The rest of the workflow will be implemented in later modules.</p>
      </div>
    </div>
  `
})
export class BookingComponent {}
