'use client';

import { FaEdit, FaTrash } from 'react-icons/fa';

interface Deudor {
    id: number;
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

interface Props {
    deudores: Deudor[];
    handleEditClick: (deudor: Deudor) => void;
    handleDelete: (id: number) => void;
  }

export default function TableComponent({ deudores, handleEditClick, handleDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm divide-y divide-gray-200">
        <thead className="bg-blue-500 text-white text-left text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Monto Total</th>
            <th className="px-4 py-3">Monto Pagado</th>
            <th className="px-4 py-3">Saldo Pendiente</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Observaciones</th>
            <th className="px-4 py-3">Atendido por</th>
            <th className="px-4 py-3 text-center">Creado</th>
            <th className="px-4 py-3 text-center">Actualizado</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 text-sm divide-y">
          {deudores.length > 0 ? (
            deudores.map((deudor) => (
              <tr key={deudor.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{deudor.cliente}</td>
                <td className="px-4 py-3">${Number(deudor.monto_total ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3">${Number(deudor.monto_pagado ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3">${Number(deudor.saldo_pendiente ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      deudor.estado === 'pagado'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {deudor.estado}
                  </span>
                </td>
                <td className="px-4 py-3">{deudor.observaciones || '-'}</td>
                <td className="px-4 py-3">
                  {deudor.user_id === 1
                    ? 'Ana Leticia Cruz de Paz'
                    : 'Otro'}
                </td>
                <td className="px-4 py-3 text-center">
                  {deudor.created_at
                    ? new Date(deudor.created_at).toLocaleDateString()
                    : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  {deudor.updated_at
                    ? new Date(deudor.updated_at).toLocaleDateString()
                    : '-'}
                </td>
                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    onClick={() => handleEditClick(deudor)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(deudor.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center px-4 py-6 text-gray-500">
                No hay deudores registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
