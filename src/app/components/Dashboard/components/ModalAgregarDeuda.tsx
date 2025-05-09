'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { montoTotal } from '@/app/helpers/Notes';

// Define the Cliente type
interface Cliente {
  id: string;
  cliente: string;
}

export default function ModalAgregarDeuda({
  clientes,
  onClose,
  totalSales,
  onCompleteVenta,
}: {
  clientes: Cliente[];
  onClose: () => void;
  totalSales: number;
  onCompleteVenta: () => Promise<void>;
}) {
  const [clienteId, setClienteId] = useState('');

  const handleAgregarDeuda = async () => {
    if (!clienteId) return;
const data= { id: clienteId, monto_total: totalSales };
    try {
      await onCompleteVenta(); // completar venta como normalmente
      await montoTotal(data);

      Swal.fire({
        icon: 'success',
        title: 'Deuda registrada exitosamente',
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar deuda',
      });
    }
  };
console.log(clienteId, totalSales);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Agregar deuda</h2>

        <label className="block mb-2 font-medium">Selecciona cliente:</label>
        <select
          className="w-full border px-4 py-2 rounded"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">-- Seleccionar cliente --</option>
          {clientes.map((c: Cliente) => (
            <option key={c.id} value={c.id}>
              {c.cliente}
            </option>
          ))}
        </select>

        <p className="mt-4 font-semibold">Monto a deber: ${totalSales.toFixed(2)}</p>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={handleAgregarDeuda} className="px-4 py-2 bg-blue-600 text-white rounded">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
