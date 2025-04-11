"use client";
import React, { useState } from 'react';
import { Button, Table, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';

type Venta = {
  id: number;
  fecha: string;
  total: number;
  created_at: string;
  updated_at: string;
};

const ReportesVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalVentas, setTotalVentas] = useState(0);

  const fetchVentas = async (tipo: 'getToday' | 'getMonth' | 'getYear') => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/ventas/reportes/${tipo}`);
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

  return (
    <Container className="my-5 p-4 rounded shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Reporte de Ventas</h2>

      <div className="flex justify-center gap-4 mb-4">
        <Button variant="primary" onClick={() => fetchVentas('getToday')}>Ventas por Día</Button>
        <Button variant="success" onClick={() => fetchVentas('getMonth')}>Ventas por Mes</Button>
        <Button variant="warning" onClick={() => fetchVentas('getYear')}>Ventas por Año</Button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && ventas.length === 0 && (
        <Alert variant="info" className="text-center">
          No hay ventas por mostrar
        </Alert>
      )}

      {!loading && ventas.length > 0 && (
        <>
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
    </Container>
  );
};

export default ReportesVentas;
