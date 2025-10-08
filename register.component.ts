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
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
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

