"use client";

import React from 'react';
import { Accordion, Container } from 'react-bootstrap';
import ReporteGrafico from './components/ReporteGrafico';
import { useProducto } from '@/app/hooks/useProductos';
import { useGetNotes } from '@/app/hooks/useNotes';
import GraficaTickets from './components/GraficaTickets';
import GraficaDeudores from './components/GraficaDeudores';

const ReportesVentas = () => {
  const { producto: catalogoDataFromApi = { data: [] } } = useProducto();
  const { notes: fetchedNotes = { data: [] } } = useGetNotes();

  return (
    <Container className="my-5">
      <h2 className="text-3xl font-bold text-center mb-6">Reportes de Ventas</h2>

      <Accordion defaultActiveKey="0" flush alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>📊 Reportes de Ventas por Tiempo</Accordion.Header>
          <Accordion.Body>
            <ReporteGrafico tipo="getToday" titulo="Por Día" />
            <ReporteGrafico tipo="getMonth" titulo="Por Mes" />
            <ReporteGrafico tipo="getYear" titulo="Por Año" />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>🥧 Productos Más Vendidos (Tickets)</Accordion.Header>
          <Accordion.Body>
            <GraficaTickets productos={catalogoDataFromApi?.data || []} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>📈 Reporte de Deudores</Accordion.Header>
          <Accordion.Body>
            <GraficaDeudores notes={fetchedNotes?.data || []} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default ReportesVentas;
