import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Roles } from '../constants/Roles';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  username: string | null = null;
  showMenuAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if(this.authService.hasRole(Roles.ADMIN)) {
      this.showMenuAdmin = true;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
