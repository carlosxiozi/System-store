"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Form, Dropdown, Table, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

interface Venta {
  id: number;
  fecha: string;
  total: string;
  cantidad: number;
  created_at: string;
  updated_at: string;
}

const ReportesPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [filtro, setFiltro] = useState<string>("dia");
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [sumaTotalVenta, setSumaTotalVenta] = useState<number>(0);
  const [cantidadTotalVendida, setCantidadTotalVendida] = useState<number>(0);

  const handleFiltroChange = (selectedFiltro: string) => {
    setFiltro(selectedFiltro);
    if (selectedFiltro !== "anio_mes") {
      setMesSeleccionado(null);
    }
  };

  const handleMesChange = (mes: number) => {
    setMesSeleccionado(mes);
  };

  // Usamos useCallback para evitar que la función se recree en cada render
  const fetchVentas = useCallback(async () => {
    setLoading(true);
    try {
      const url = `http://localhost:8000/api/ventas`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("No se pudo obtener los datos de ventas.");
      }
      const data = await response.json();

      let filteredVentas = data;
      const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
      const todayString = today.toISOString().split('T')[0];

      // Filtrado según el filtro seleccionado
      switch (filtro) {
        case "dia":
          filteredVentas = data.filter((venta: Venta) => {
            const ventaFecha = new Date(venta.fecha);
            const ventaFechaString = ventaFecha.toISOString().split('T')[0];
            return ventaFechaString === todayString;
          });
          break;

        case "semana":
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes de esta semana
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Domingo de esta semana

          filteredVentas = data.filter((venta: Venta) => {
            const ventaFecha = new Date(venta.fecha);
            return ventaFecha >= startOfWeek && ventaFecha <= endOfWeek && ventaFecha.getFullYear() === today.getFullYear();
          });
          break;

        case "mes":
          filteredVentas = data.filter((venta: Venta) => {
            const ventaFecha = new Date(venta.fecha);
            return ventaFecha.getMonth() === today.getMonth() && ventaFecha.getFullYear() === today.getFullYear();
          });
          break;

        case "anio_mes":
          if (mesSeleccionado !== null) {
            filteredVentas = data.filter((venta: Venta) => {
              const ventaFecha = new Date(venta.fecha);
              return ventaFecha.getMonth() === mesSeleccionado - 1; // Meses en JS son de 0 a 11
            });
          }
          break;

        default:
          break;
      }

      // Calcular la suma total de ventas y la cantidad total vendida
      const sumaTotalVenta = filteredVentas.reduce(
        (acc: number, venta: Venta) => acc + parseFloat(venta.total),
        0
      );

      const cantidadTotalVendida = filteredVentas.reduce(
        (acc: number, venta: Venta) => acc + venta.cantidad,
        0
      );

      setSumaTotalVenta(sumaTotalVenta);
      setCantidadTotalVendida(cantidadTotalVendida);

      setVentas(filteredVentas);
    } catch (error) {
      console.error("Error fetching ventas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al obtener los datos de ventas.",
      });
    } finally {
      setLoading(false);
    }
  }, [filtro, mesSeleccionado]); // Dependencias de useCallback

  // Llamamos a fetchVentas cada vez que cambian las dependencias
  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={6}>
          <h2>Reportes de Ventas</h2>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-filtro">
              Ver por:
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFiltroChange("dia")}>Día</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltroChange("semana")}>Semana</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltroChange("mes")}>Mes</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFiltroChange("anio_mes")}>Año/Mes</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {filtro === "anio_mes" && (
        <Row className="mb-4">
          <Col md={12}>
            <Form.Group controlId="mes">
              <Form.Label>Selecciona un mes</Form.Label>
              <Form.Control as="select" onChange={(e) => handleMesChange(parseInt(e.target.value))}>
                <option value="">Selecciona el mes</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <h4>Suma Total de Ventas: ${sumaTotalVenta.toFixed(2)}</h4>
          <h4>Cantidad Total Vendida: {cantidadTotalVendida}</h4>
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ? (
            <div className="text-center">Cargando...</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Fecha de Creación</th>
                  <th>Fecha de Actualización</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length > 0 ? (
                  ventas.map((venta) => (
                    <tr key={venta.id}>
                      <td>{venta.id}</td>
                      <td>{venta.fecha}</td>
                      <td>${venta.total}</td>
                      <td>{new Date(venta.created_at).toLocaleString()}</td>
                      <td>{new Date(venta.updated_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No hay ventas para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ReportesPage;
