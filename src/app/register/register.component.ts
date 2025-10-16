import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
    console.log('Registration attempt with:', this.credentials);
    
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

    // Temporary mock for testing - remove when API is working
    if (this.credentials.email === 'test@test.com') {
      console.log('Using mock registration');
      this.isLoading = false;
      alert('Mock registration successful! Redirecting to login...');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.register(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
          if (error.status === 200 || error.status === 201) {
            console.log('Registration successful (status 200/201)');
            this.router.navigate(['/login']);
          } else if (error.name === 'HttpErrorResponse' && error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please ensure the API is running on http://localhost:7231';
          } else {
            this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          }
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

