'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { monto_pagado } from '@/app/helpers/Notes';

interface Cliente {
  id: string;
  cliente: string;
}

export default function ModalAbonarDeuda({ clientes, onClose }: { clientes: Cliente[]; onClose: () => void }) {
  const [clienteId, setClienteId] = useState('');
  const [montoAbonar, setMontoAbonar] = useState('');

  const handleAbonar = async () => {
    if (!clienteId || !montoAbonar) return;

    try {
      await monto_pagado({ id: clienteId, monto_pagado: montoAbonar });

      Swal.fire({
        icon: 'success',
        title: 'Abono registrado exitosamente',
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar abono',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Abonar a deuda</h2>

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

        <label className="block mt-4 mb-2 font-medium">Monto a abonar:</label>
        <input
          type="number"
          value={montoAbonar}
          onChange={(e) => setMontoAbonar(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={handleAbonar} className="px-4 py-2 bg-green-600 text-white rounded">Abonar</button>
        </div>
      </div>
    </div>
  );
}
