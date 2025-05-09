"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Table } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Note = {
    cliente: string;
    monto_total: number;
    monto_pagado: number;
    saldo_pendiente: number;
};

interface Props {
    notes: Note[];
}

const GraficaDeudores: React.FC<Props> = ({ notes }) => {
    const clientes = notes.map(note => note.cliente);
    const monto_total = notes.map(note => Number(note.monto_total || 0));
    const monto_pagado = notes.map(note => Number(note.monto_pagado || 0));
    const saldo_pendiente = notes.map(note => Number(note.saldo_pendiente || 0));

    const data = {
        labels: clientes,
        datasets: [
            {
                label: 'Monto Total',
                data: monto_total,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Monto Pagado',
                data: monto_pagado,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Saldo Pendiente',
                data: saldo_pendiente,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Resumen de Anotaciones por Cliente',
            },
        },
    };

    return (
        <div className="my-8 p-4 bg-white rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">Resumen de Anotaciones</h3>
            <Bar data={data} options={options} />

            <Table striped bordered hover responsive className="mt-5">
                <thead className="bg-light">
                    <tr>
                        <th>Cliente</th>
                        <th>Monto Total</th>
                        <th>Monto Pagado</th>
                        <th>Saldo Pendiente</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((note, idx) => (
                        <tr key={idx}>
                            <td>{note.cliente}</td>
                            <td>${Number(note.monto_total).toFixed(2)}</td>
                            <td>${Number(note.monto_pagado).toFixed(2)}</td>
                            <td>${Number(note.saldo_pendiente).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default GraficaDeudores;
