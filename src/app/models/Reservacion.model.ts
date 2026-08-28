import { HuespedResponse } from './Huesped.model';
import { HabitacionResponse } from './Habitacion.model';

export interface ReservacionRequest {
    idHuesped: number;
    idHabitacion: number;
    fechaHora: string; // Formato: "dd/MM/yyyy HH:mm"
}

export interface ReservacionResponse {
    id: number;
    idHuesped: number;
    idHabitacion: number;
    fechaHora: string;
    estadoReserva: string;
    estadoRegistro: string;
    huesped?: HuespedResponse;
    habitacion?: HabitacionResponse;
}

export enum EstadoReserva {
    CONFIRMADA = 'CONFIRMADA',
    CANCELADA = 'CANCELADA',
    FINALIZADA = 'FINALIZADA',
    PENDIENTE = 'PENDIENTE'
}

export function formatearFecha(fechaHora: string): string {
    if (!fechaHora) return '';
    const fecha = new Date(fechaHora);
    return fecha.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function getEstadoReservaLabel(estado: string): string {
    const estados: Record<string, string> = {
        'CONFIRMADA': 'Confirmada',
        'CANCELADA': 'Cancelada',
        'FINALIZADA': 'Finalizada',
        'PENDIENTE': 'Pendiente'
    };
    return estados[estado] || estado;
}

export function getEstadoReservaColor(estado: string): string {
    const colores: Record<string, string> = {
        'CONFIRMADA': 'success',
        'CANCELADA': 'danger',
        'FINALIZADA': 'secondary',
        'PENDIENTE': 'warning'
    };
    return colores[estado] || 'primary';
}