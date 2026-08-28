export interface HabitacionRequest {
    numero: number;
    tipo: string;
    precio: number;
    capacidad: number;
}

export interface HabitacionResponse {
    id: number;
    numero: number;
    tipo: string;
    precio: number;
    capacidad: number;
}

// Utilidad para formatear el precio
export function formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(precio);
}