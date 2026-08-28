export interface HuespedRequest {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    telefono: string;
    documento: string;
    nacionalidad: string;
}

export interface HuespedResponse {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    telefono: string;
    documento: string;
    nacionalidad: string;
}

// Utilidad para obtener nombre completo
export function getNombreCompleto(huesped: HuespedResponse): string {
    return `${huesped.nombre} ${huesped.apellidoPaterno} ${huesped.apellidoMaterno}`;
}