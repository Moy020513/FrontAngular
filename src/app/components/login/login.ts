import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Credenciales inválidas'; }
    });
  }
}




