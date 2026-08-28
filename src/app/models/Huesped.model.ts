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
    paterno: string;
    materno: string;
    email: string;
    telefono: string;
    documento: string;
    nacionalidad: string;
}



// Utilidad para obtener nombre completo
export function getNombreCompleto(huesped: HuespedResponse): string {
    if (!huesped) return '';
    const partes = [];
    if (huesped.nombre) partes.push(huesped.nombre);
    if (huesped.paterno) partes.push(huesped.paterno);
    if (huesped.materno) partes.push(huesped.materno);
    return partes.join(' ');
}
