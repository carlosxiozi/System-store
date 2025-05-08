export interface Deudor {
    id: string;
    cliente: string;
    monto_total: number;
    monto_pagado: number;
    saldo_pendiente: number;
    estado: 'Pendiente' | 'Pagado';
    observaciones?: string;
    user_id: string;
}
export interface DeduroResponse {
    type: string;
    message: string;
    data: Deudor[];
}