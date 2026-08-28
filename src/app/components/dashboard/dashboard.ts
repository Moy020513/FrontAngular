import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth';
import { UsuariosService } from '../../services/usuarios';
import { HuespedesService } from '../../services/huespedes';
import { HabitacionesService } from '../../services/habitaciones';
import { ReservacionesService } from '../../services/reservaciones';
import { Roles } from '../../constants/Roles';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalHuespedes: number = 0;
  totalHabitaciones: number = 0;
  totalReservas: number = 0;
  totalUsuarios: number = 0;
  showMenuAdmin: boolean = false;
  isRootRoute: boolean = true;

  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private huespedesService: HuespedesService,
    private habitacionesService: HabitacionesService,
    private reservacionesService: ReservacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showMenuAdmin = this.authService.hasRole(Roles.ADMIN);
    this.cargarEstadisticas();

    // Detectar cambios de ruta para mostrar/ocultar las estadísticas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Verificar si estamos en la ruta raíz del dashboard
      this.isRootRoute = event.url === '/dashboard' || event.url === '/dashboard/';
    });
  }

  cargarEstadisticas(): void {
    // Cargar huéspedes
    this.huespedesService.getHuespedes().subscribe({
      next: (data) => {
        this.totalHuespedes = data.length;
      },
      error: () => {
        this.totalHuespedes = 0;
      }
    });

    // Cargar habitaciones
    this.habitacionesService.getHabitaciones().subscribe({
      next: (data) => {
        this.totalHabitaciones = data.length;
      },
      error: () => {
        this.totalHabitaciones = 0;
      }
    });

    // Cargar reservas
    this.reservacionesService.getReservaciones().subscribe({
      next: (data) => {
        this.totalReservas = data.length;
      },
      error: () => {
        this.totalReservas = 0;
      }
    });

    // Cargar usuarios (solo si es admin)
    if (this.showMenuAdmin) {
      this.usuariosService.getUsuarios().subscribe({
        next: (data) => {
          this.totalUsuarios = data.length;
        },
        error: () => {
          this.totalUsuarios = 0;
        }
      });
    }
  }
}