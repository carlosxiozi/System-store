'use client';
import React, { useState, useEffect } from 'react';

interface Deudor {
    id: number; // Ensure 'id' is a number to match the parent component
    cliente: string;
    monto_total: number;
    monto_pagado: number;
    saldo_pendiente: number;
    estado: 'pendiente' | 'pagado';
    observaciones?: string;
    user_id: number;
    created_at?: string;
    updated_at?: string;
}

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  initialData: Deudor;
  onSave: (data: Deudor) => void;
}

export default function ModalComponent({ show, handleClose, initialData, onSave }: ModalProps) {
  const [form, setForm] = useState<Deudor>(initialData);

  useEffect(() => {
    setForm({
      id: initialData.id || 0,
      cliente: initialData.cliente || '',
      monto_total: initialData.monto_total ?? 0,
      monto_pagado: initialData.monto_pagado ?? 0,
      saldo_pendiente: initialData.saldo_pendiente ?? 0,
      estado: initialData.estado || 'pendiente',
      observaciones: initialData.observaciones || '',
      user_id: initialData.user_id || 1, // valor por defecto
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes('monto') ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    form.saldo_pendiente = form.monto_total - form.monto_pagado;
    form.estado = form.saldo_pendiente <= 0 ? 'pagado' : 'pendiente';
    onSave(form);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">{form.id ? 'Editar' : 'Crear'} Deudor</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <input id="cliente" name="cliente" value={form.cliente} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
          </div>

          <div>
            <label htmlFor="monto_total" className="block text-sm font-medium text-gray-700 mb-1">Monto Total</label>
            <input id="monto_total" name="monto_total" type="number" value={form.monto_total} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
          </div>

          <div>
            <label htmlFor="monto_pagado" className="block text-sm font-medium text-gray-700 mb-1">Monto Pagado</label>
            <input id="monto_pagado" name="monto_pagado" type="number" value={form.monto_pagado} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
          </div>

          <div >
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <input id="observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
          </div>

       
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
