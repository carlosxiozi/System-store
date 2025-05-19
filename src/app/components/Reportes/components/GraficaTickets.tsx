"use client";

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Spinner } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend);

type Producto = {
  id: number;
  name: string;
};

type Ticket = {
  id: number;
  producto_id: number;
};

interface Props {
  productos: Producto[];
}

const GraficaTickets: React.FC<Props> = ({ productos }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTickets = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+ "/api/tickets");
      const json = await response.json();

      // 👇 Asegúrate de usar el array correcto
      const ticketData = Array.isArray(json) ? json : json.data;

      setTickets(ticketData || []);
    } catch (error) {
      console.error("Error al obtener tickets", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  fetchTickets();
}, []);

console.log("Tickets:", tickets);
console.log("Productos:", productos);

  const productoFrecuencia = tickets.reduce((acc: Record<number, number>, ticket) => {
    acc[ticket.producto_id] = (acc[ticket.producto_id] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(productoFrecuencia)
    .map(id => productos.find(p => p.id === Number(id)))
    .filter(Boolean)
    .map(p => p!.name);

  const data = Object.keys(productoFrecuencia)
    .map(id => productoFrecuencia[Number(id)]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Cantidad de Ventas por Producto',
        data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#8AFFC1', '#FF9F40', '#9966FF',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="my-8 p-4 bg-white rounded shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-center">Productos Más Vendidos (Tickets)</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Pie data={chartData} />
      )}
    </div>
  );
};

export default GraficaTickets;
