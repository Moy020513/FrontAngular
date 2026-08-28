import { HuespedResponse } from './Huesped.model';
import { HabitacionResponse } from './Habitacion.model';

export interface ReservacionRequest {
    idHuesped: number;
    idHabitacion: number;
    fechaHora: string;
    fechaSalida: string;
}

export interface ReservacionResponse {
    id: number;
    huesped: HuespedResponse;
    habitacion: HabitacionResponse;
    fechaHora: string;
    fechaSalida: string;
    estadoReserva: string;
}

export enum EstadoReserva {
    CONFIRMADA = 'CONFIRMADA',
    CANCELADA = 'CANCELADA',
    FINALIZADA = 'FINALIZADA',
    EN_CURSO = 'EN_CURSO'
}

// Mapeo de estados a códigos numéricos (según tu backend)
export const EstadoReservaCodigo: Record<string, number> = {
    'CONFIRMADA': 1,
    'EN_CURSO': 2,
    'FINALIZADA': 3,
    'CANCELADA': 4
};

// Mapeo de códigos a estados
export const CodigoEstadoReserva: Record<number, string> = {
    1: 'CONFIRMADA',
    2: 'EN_CURSO',
    3: 'FINALIZADA',
    4: 'CANCELADA'
};

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
        'EN_CURSO': 'En Curso',
        'FINALIZADA': 'Finalizada',
        'CANCELADA': 'Cancelada'
    };
    return estados[estado] || estado;
}

export function getEstadoReservaColor(estado: string): string {
    const colores: Record<string, string> = {
        'CONFIRMADA': 'success',
        'EN_CURSO': 'info',
        'FINALIZADA': 'secondary',
        'CANCELADA': 'danger'
    };
    return colores[estado] || 'primary';
}

// Obtener código numérico del estado
export function getCodigoEstado(estado: string): number {
    return EstadoReservaCodigo[estado] || 1; // Por defecto CONFIRMADA (1)
}