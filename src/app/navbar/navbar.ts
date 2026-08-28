import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth';
import { Roles } from '../constants/Roles';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  username: string | null = null;
  showMenuAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.showMenuAdmin = this.authService.hasRole(Roles.ADMIN);
  }

  logout(): void {
    this.authService.logout();
  }
}