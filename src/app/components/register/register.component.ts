import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Added 'currency' to the Reactive Form with a default of INR
  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    yearsExperience: ['', [Validators.required, Validators.min(0)]],
    subjectExpertise: ['', Validators.required],
    pricePerHour: ['', [Validators.required, Validators.min(100)]],
    currency: ['INR', Validators.required] 
  });

  errorMessage = '';
  successMessage = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.errorMessage = '';
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Registration successful! Your profile is pending review before going live.';
          setTimeout(() => this.router.navigate(['/login']), 3500);
        },
        error: (err) => this.errorMessage = err.error?.error || 'Registration failed'
      });
    }
  }
}