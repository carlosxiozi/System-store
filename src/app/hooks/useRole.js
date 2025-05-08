import { useState, useEffect } from 'react';
import { getRoles, syncPermisos } from '../helpers/Roles';

export function useGetRoles() {
    const [roles, setRoles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const data = await getRoles();
                setRoles(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchRoles();
    }, []);
    return { roles, loading, error };
}

export function useSyncPermissions() {
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const syncPermissions = async (id, permissions) => {
    setSyncLoading(true);
    setSyncError(null);
    try {
      const result = await syncPermisos(id, permissions);
      return result;
    } catch (err) {
      setSyncError(err);
      throw err; // para que el componente pueda manejarlo
    } finally {
      setSyncLoading(false);
    }
  };

  return { syncPermissions, syncLoading, syncError };
}
