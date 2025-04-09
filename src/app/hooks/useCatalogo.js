import { useState, useEffect, use } from 'react';
import { getCatalogoApi, updateCatalogoApi, deleteCatalogoApi } from '../helpers/catalogoApi';
import {createCatalogoApi} from '../helpers/Catalogo';
export function useCatalogo() {
    const [catalogo, setCatalogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCatalogo() {
            try {
                const data = await getCatalogoApi();
                setCatalogo(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCatalogo();
    }, []);

    return { catalogo, loading, error };
}