'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useSyncPermissions } from '@/app/hooks/useRole';
interface ModalPermissionProps {
  role: { id: string; name: string; permissions: string[] };
  onClose: () => void;
}

const allPermissions = [
  'Usuarios', 'Roles', 'Productos', 'Categoria', 'Deudores',
   'Reportes', 'Dashboard', 'Configuración',
];

export default function ModalPermission({ role, onClose }: ModalPermissionProps) {
  const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);


  useEffect(() => {
    if (role?.permissions) {
      const formattedPermissions = Array.isArray(role.permissions)
        ? role.permissions
        : JSON.parse(role.permissions);
      setCurrentPermissions(formattedPermissions);
    }
  }, [role]);

  const handleToggle = (perm: string) => {
    setCurrentPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };
  const { syncPermissions, syncLoading } = useSyncPermissions();

  const handleSave = async () => {
    try {
      await syncPermissions(role.id, currentPermissions);
      Swal.fire({
        icon: 'success',
        title: 'Permisos actualizados correctamente',
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar permisos',
        text: 'Intenta nuevamente más tarde.',
      });
    }
  };
  
  
if(syncLoading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
          Editar permisos para <span className="text-blue-600">{role?.name || 'Sin nombre'}</span>
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {allPermissions.map((perm) => (
            <div
              key={perm}
              className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-gray-700 font-medium capitalize">{perm}</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={currentPermissions.includes(perm)}
                  onChange={() => handleToggle(perm)}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-all duration-300"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 bg-white rounded-md hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-white font-semibold rounded-md transition bg-blue-600 hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}


