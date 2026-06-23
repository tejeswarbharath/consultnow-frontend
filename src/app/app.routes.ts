import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'expert-profile',
    loadComponent: () => import('./components/expert-profile/expert-profile').then(m => m.ExpertProfile),
    canActivate: [authGuard]
  },
  {
    path: 'experts',
    loadComponent: () => import('./components/expert-discovery/expert-discovery.component').then(m => m.ExpertDiscoveryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'chat/:expertId',
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },
  // FIX: Removed authGuard from these two routes so Guests can redirect back from Razorpay
  {
    path: 'payment-success',
    loadComponent: () => import('./services/payment-success.component').then(m => m.PaymentSuccessComponent)
  },
  {
    path: 'payment-failure',
    loadComponent: () => import('./services/payment-failure.component').then(m => m.PaymentFailureComponent)
  },
  {
    path: 'booking/:id',
    loadComponent: () => import('./components/booking/booking.component').then(m => m.BookingComponent)
  },
  { 
    path: '', 
    loadComponent: () => import('./components/expert-discovery/expert-discovery.component').then(m => m.ExpertDiscoveryComponent) 
  },
  { path: '**', redirectTo: '' }
];