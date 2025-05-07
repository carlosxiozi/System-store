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
export function useSyncPermissions(id, permissions) {
    const [data, setData] = useState(null); // estado principal
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      async function fetchPermissions() {
        try {
          const result = await syncPermisos(id, permissions);
          setData(result);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
  
      if (id) {
        fetchPermissions();
      }
    }, [id, permissions]); // incluyo permissions en dependencias si cambian
  
    return { data, loading, error };
  }