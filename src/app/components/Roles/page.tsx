"use client";

import {  useState } from 'react';
import { FaUserCircle,  FaTrashAlt, FaEdit, FaKey } from 'react-icons/fa';
import { useGetRoles } from '@/app/hooks/useRole'; // correcto hook
import Loading from '@/app/Loading/page';
import Swal from 'sweetalert2';
import ModalPermission from './components/ModalPermisisons';
interface Role {
    id: string;
    name: string;
    permissions: string[];
}

export default function RoleAssignmentCards() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    roles = [] as { id: string; name: string; permissions: string[] }[], 
    loading: loadingRoles,
    error: errorRoles,
  } = useGetRoles(); // <-- corregido el hook

console.log(roles); // Verifica que roles tenga datos

interface SwalResult {
    isConfirmed: boolean;
    isDenied: boolean;
    isDismissed: boolean;
}

const handleDelete = (roleId: Role['id']): void => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el rol permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result: SwalResult) => {
        if (result.isConfirmed) {
            console.log(`Eliminar rol con ID: ${roleId}`);
            // aquí iría tu lógica de eliminación real
            Swal.fire('Eliminado', 'El rol ha sido eliminado.', 'success');
        }
    });
};

  if (loadingRoles) return <Loading />;
  if (errorRoles && (roles ?? []).length === 0) return <p className="text-red-500">Error al cargar roles.</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-1">
        <h1 className="text-xl font-semibold text-gray-800">Gestión de Roles</h1>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {roles?.map((role) => (
          <div
            key={role.id}
            className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center text-center border border-gray-200 relative"
          >
            <FaUserCircle className="text-4xl text-gray-500 mb-2" />
            <h3 className="text-lg font-semibold text-black">{role.name}</h3>

            <div className="flex flex-col gap-2 mt-4 w-full">
              <button
                onClick={() => {
                  setSelectedRole(role);
                  setShowModal(true);
                }}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                <FaKey /> Editar Permisos
              </button>

              <button
                onClick={() => console.log(`Editar rol ID: ${role.id}`)}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                <FaEdit /> Editar Rol
              </button>

              <button
                onClick={() => handleDelete(role.id)}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                <FaTrashAlt /> Eliminar
              </button>
            </div>
          </div>
        ))}
        : {roles?.length === 0 && (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 flex items-center justify-center h-full p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-gray-500">No hay roles disponibles.</p>
            </div>
            )}
      </div>

      {showModal && selectedRole && (
        <ModalPermission
          role={selectedRole}
          onClose={() => {
            setShowModal(false);
            setSelectedRole(null);
          }}
        />
      )}
    </>
  );
}
