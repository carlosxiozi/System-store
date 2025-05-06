// components/Productos/components/table.tsx
'use client';

import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface Producto {
    id: number;
    name: string;
    descripcion: string;
    precio: number;
    categoria_id: string;
    code: string;
}

interface ProductosTableProps {
    data: Producto[];
    handleEditClick: (producto: Producto) => void;
    handleDelete: (id: number) => void;
}

const ProductosTable: React.FC<ProductosTableProps> = ({ data, handleEditClick, handleDelete }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Descripción</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Precio</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Categoría</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Código</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length > 0 ? (
                        data.map((producto) => (
                            <tr key={producto.id} className="hover:bg-gray-200 transition">
                                <td className="px-4 py-3 text-sm text-gray-700">{producto.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{producto.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{producto.descripcion}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">${producto.precio}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{producto.categoria_id}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{producto.code}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleEditClick(producto)}
                                        className="inline-flex items-center px-2 py-1 text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded transition"
                                    >
                                        <FiEdit className="mr-1" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(producto.id)}
                                        className="inline-flex items-center px-2 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition ml-2"
                                    >
                                        <FiTrash2 className="mr-1" /> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No se encontraron productos.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductosTable;
