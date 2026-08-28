import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../enviroments/enviroments';
import { HabitacionRequest, HabitacionResponse } from '../models/Habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  private apiUrl: string = environment.apiHabitaciones;

  constructor(private http: HttpClient) { }

  getHabitaciones(): Observable<HabitacionResponse[]> {
    return this.http.get<HabitacionResponse[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener las habitaciones', error);
        return of([]);
      })
    );
  }

  getHabitacionById(id: number): Observable<HabitacionResponse> {
    return this.http.get<HabitacionResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener la habitación', error);
        return throwError(() => error);
      })
    );
  }

  postHabitacion(habitacion: HabitacionRequest): Observable<HabitacionResponse> {
    return this.http.post<HabitacionResponse>(this.apiUrl, habitacion).pipe(
      catchError(error => {
        console.error('Error al registrar la habitación', error);
        return throwError(() => error);
      })
    );
  }

  putHabitacion(habitacion: HabitacionRequest, id: number): Observable<HabitacionResponse> {
    return this.http.put<HabitacionResponse>(`${this.apiUrl}/${id}`, habitacion).pipe(
      catchError(error => {
        console.error('Error al actualizar la habitación', error);
        return throwError(() => error);
      })
    );
  }

  deleteHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar la habitación', error);
        return throwError(() => error);
      })
    );
  }
}