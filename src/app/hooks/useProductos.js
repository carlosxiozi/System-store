import { useState, useEffect } from 'react';
import { getProductoApi } from '../helpers/Producto';
export function useProducto() {
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fecthProducto() {
            try {
                const data = await getProductoApi();
                setProducto(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fecthProducto();
    }, []);

    return { producto, loading, error };
}