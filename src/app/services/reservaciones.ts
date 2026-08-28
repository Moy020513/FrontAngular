import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../enviroments/enviroments';
import { ReservacionRequest, ReservacionResponse, getCodigoEstado } from '../models/Reservacion.model';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {

  private apiUrl: string = environment.apiReservaciones;

  constructor(private http: HttpClient) { }

  getReservaciones(): Observable<ReservacionResponse[]> {
    return this.http.get<ReservacionResponse[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener las reservaciones', error);
        return of([]);
      })
    );
  }

  getReservacionById(id: number): Observable<ReservacionResponse> {
    return this.http.get<ReservacionResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener la reservación', error);
        return throwError(() => error);
      })
    );
  }

  postReservacion(reservacion: ReservacionRequest): Observable<ReservacionResponse> {
    return this.http.post<ReservacionResponse>(this.apiUrl, reservacion).pipe(
      catchError(error => {
        console.error('Error al registrar la reservación', error);
        return throwError(() => error);
      })
    );
  }

  putReservacion(reservacion: ReservacionRequest, id: number): Observable<ReservacionResponse> {
    return this.http.put<ReservacionResponse>(`${this.apiUrl}/${id}`, reservacion).pipe(
      catchError(error => {
        console.error('Error al actualizar la reservación', error);
        return throwError(() => error);
      })
    );
  }

  deleteReservacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar la reservación', error);
        return throwError(() => error);
      })
    );
  }

  // Ahora recibe el código numérico del estado
  actualizarEstadoReservacion(id: number, estado: string): Observable<ReservacionResponse> {
    const codigoEstado = getCodigoEstado(estado); // Convertir string a número
    console.log(`📝 Cambiando estado de reserva ${id} a: ${estado} (código: ${codigoEstado})`);
    
    return this.http.put<ReservacionResponse>(`${this.apiUrl}/${id}/estado/${codigoEstado}`, {}).pipe(
      catchError(error => {
        console.error('Error al actualizar el estado de la reservación', error);
        return throwError(() => error);
      })
    );
  }
}