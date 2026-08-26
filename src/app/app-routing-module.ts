import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Usuarios } from './components/usuarios/usuarios';
import { AuthGuard } from './guards/Auth.guard';
import { Roles } from './constants/Roles';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], children: [
    { path: 'usuarios', component: Usuarios, canActivate: [AuthGuard], data: { roles: [Roles.ADMIN]} },
  ] },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
