import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) { }

  onSubmit() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Register response:', response);
        localStorage.setItem('token', response.token);
        this.userService.updateUserTerm(response.user); // Let UserService handle localStorage
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Register failed:', error);
      }
    });
  }
}