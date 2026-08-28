import { NgModule } from '@angular/core'; // <-- Quita provideBrowserGlobalErrorListeners
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Usuarios } from './components/usuarios/usuarios';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptors';
import { Huespedes } from './components/huespedes/huespedes';
import { Habitaciones } from './components/habitaciones/habitaciones';
import { Reservaciones } from './components/reservaciones/reservaciones';

@NgModule({
  declarations: [
    App,
    Dashboard,
    Login,
    Navbar,
    Footer,
    Usuarios,
    Huespedes,
    Habitaciones,
    Reservaciones,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}