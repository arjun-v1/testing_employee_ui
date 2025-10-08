import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Register</h2>
        
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="credentials.email" 
              required 
              class="form-control"
              placeholder="Enter your email">
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="credentials.password" 
              required 
              class="form-control"
              placeholder="Enter your password">
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password:</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              [(ngModel)]="credentials.confirmPassword" 
              required 
              class="form-control"
              placeholder="Confirm your password">
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="isLoading">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>

          <button 
            type="button" 
            class="btn btn-secondary"
            (click)="goToLogin()">
            Back to Login
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-card h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 0.5rem;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      text-align: center;
    }
  `]
})
export class RegisterComponent {
  credentials = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password || !this.credentials.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          // Check if it's actually successful (status 200/201) but different response format
          if (error.status === 200 || error.status === 201) {
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}