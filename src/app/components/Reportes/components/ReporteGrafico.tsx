"use client";

import React, { useEffect, useState } from 'react';
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
import { Table, Spinner } from 'react-bootstrap';
import Loading from '@/app/Loading/page';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Venta = {
  id: number;
  fecha: string;
  total: number;
  created_at: string;
  updated_at: string;
};

interface Props {
  tipo: 'getToday' | 'getMonth' | 'getYear';
  titulo: string;
}

const ReporteGrafico: React.FC<Props> = ({ tipo, titulo }) => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalVentas, setTotalVentas] = useState(0);

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas/reportes/${tipo}`);
        const data = await response.json();
        setVentas(data);
        const total = data.reduce((sum: number, venta: Venta) => sum + Number(venta.total), 0);
        setTotalVentas(total);
      } catch (error) {
        console.error('Error al obtener las ventas', error);
        setVentas([]);
        setTotalVentas(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [tipo]);

  const chartData = {
    labels: ventas.map((venta) => venta.fecha),
    datasets: [
      {
        label: 'Total de Ventas',
        data: ventas.map((venta) => venta.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Ventas (${titulo})`,
      },
    },
  };

  return (
    <div className="my-8 p-4 bg-white rounded shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-center">Reporte de Ventas - {titulo}</h3>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && ventas.length === 0 && <Loading />}

      {!loading && ventas.length > 0 && (
        <>
          <div className="mb-5">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <Table bordered hover responsive className="rounded shadow-sm text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Creado en</th>
                <th>Actualizado en</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.fecha}</td>
                  <td>${Number(venta.total).toFixed(2)}</td>
                  <td>{new Date(venta.created_at).toLocaleString()}</td>
                  <td>{new Date(venta.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-right text-lg font-semibold mt-3">
            Total de Ventas: <span className="text-green-600">${totalVentas.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ReporteGrafico;
