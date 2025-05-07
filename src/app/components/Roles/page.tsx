'use client';

import { useState } from 'react';
import { FaUserCircle, FaTrashAlt, FaEdit, FaKey } from 'react-icons/fa';
import { useGetRoles } from '@/app/hooks/useRole';
import Loading from '@/app/Loading/page';
import Swal from 'sweetalert2';
import ModalPermission from './components/ModalPermisisons';
import ModalRol from './components/ModalRol';
import { Tooltip, IconButton } from '@mui/material';
import {destroy} from '@/app/helpers/Roles';
interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export default function RoleAssignmentCards() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    roles = [] as Role[],
    loading: loadingRoles,
    error: errorRoles,
  } = useGetRoles();

  const handleDelete = async (roleId: Role['id']): Promise<void> => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el rol permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await destroy(roleId);
          Swal.fire('Eliminado', 'El rol ha sido eliminado.', 'success');
        } catch  {
          Swal.fire('Error', 'No se pudo eliminar el rol.', 'error');
        }
      }
    });
  };

  if (loadingRoles) return <Loading />;
  if (errorRoles && (roles ?? []).length === 0)
    return <p className="text-red-500">Error al cargar roles.</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-1">
        <h1 className="text-xl font-semibold text-gray-800">Gestión de Roles</h1>
        <ModalRol isNew={true} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {roles?.map((role) => (
          <div
            key={role.id}
            className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center text-center border border-gray-200 relative"
          >
            <FaUserCircle className="text-4xl text-gray-500 mb-2" />
            <h3 className="text-lg font-semibold text-black mb-2">{role.name}</h3>

            <div className="flex justify-center gap-4 mt-2">
              <Tooltip title="Editar Permisos">
                <IconButton
                  onClick={() => {
                    setSelectedRole(role);
                    setShowModal(true);
                  }}
                  color="primary"
                >
                  <FaKey />
                </IconButton>
              </Tooltip>

              <ModalRol role={role} isNew={false}>
                <Tooltip title="Editar Rol">
                  <IconButton color="secondary">
                    <FaEdit />
                  </IconButton>
                </Tooltip>
              </ModalRol>

              <Tooltip title="Eliminar Rol">
                <IconButton onClick={() => handleDelete(role.id)} color="error">
                  <FaTrashAlt />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}

        {roles?.length === 0 && (
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
