import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[100] flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <div 
        *ngFor="let toast of toastService.toasts$ | async" 
        class="pointer-events-auto transform transition-all duration-300 ease-in-out p-4 rounded-xl shadow-2xl border flex items-start space-x-3 text-sm backdrop-blur-md animate-fade-in-down"
        [ngClass]="{
          'bg-emerald-950/90 border-emerald-500/40 text-emerald-100': toast.type === 'success',
          'bg-red-950/90 border-red-500/40 text-red-100': toast.type === 'error',
          'bg-blue-950/90 border-blue-500/40 text-blue-100': toast.type === 'info',
          'bg-amber-950/90 border-amber-500/40 text-amber-100': toast.type === 'warning'
        }">
        
        <!-- Icon -->
        <div class="shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div class="flex-1">
          <h4 *ngIf="toast.title" class="font-bold text-xs uppercase tracking-wider opacity-90 mb-0.5">{{ toast.title }}</h4>
          <p class="text-xs leading-relaxed opacity-95">{{ toast.message }}</p>
        </div>

        <button (click)="toastService.remove(toast.id)" class="shrink-0 text-white/40 hover:text-white transition-colors cursor-pointer text-xs">
          ✕
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  public toastService = inject(ToastService);
}
