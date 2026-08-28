import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Usuarios } from './components/usuarios/usuarios';
import { Huespedes } from './components/huespedes/huespedes';
import { Habitaciones } from './components/habitaciones/habitaciones';
import { Reservaciones } from './components/reservaciones/reservaciones';
import { AuthGuard } from './guards/Auth.guard';
import { Roles } from './constants/Roles';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [AuthGuard], 
    children: [
      { 
        path: 'usuarios', 
        component: Usuarios, 
        canActivate: [AuthGuard], 
        data: { roles: [Roles.ADMIN] } 
      },
      { 
        path: 'huespedes', 
        component: Huespedes, 
        canActivate: [AuthGuard] 
      },
      { 
        path: 'habitaciones', 
        component: Habitaciones, 
        canActivate: [AuthGuard] 
      },
      { 
        path: 'reservas', 
        component: Reservaciones, 
        canActivate: [AuthGuard] 
      },
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      }
    ] 
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }