import { useState, useEffect } from 'react';
import { getUsuarios } from '../helpers/Usuario';

export function useUsuarioData() {
    const [usuarios, setUsuarios] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fectchUsuario() {
            try {
                const data = await getUsuarios();
                setUsuarios(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fectchUsuario();
    }, []);
    return { usuarios, loading, error };
}