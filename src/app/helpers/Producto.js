export async function getProductoApi() {
    const response = await fetch('https://sistema-tiendasss-1.onrender.com/api/productos',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    if (!response.ok) {
        throw new Error('Error fetching producto data');
    }
    const data = await response.json();
    // Log the catalog data
    return data;
}
export async function createProductoApi(catalogo) {
    console.log('Entrando al fetch:', catalogo);

    try {
        const response = await fetch('https://sistema-tiendasss-1.onrender.com/api/productos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(catalogo),
        });

        if (!response.ok) {
            throw new Error('Error creating catalog data');
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Lanzamos el error para que el código en el hook pueda capturarlo
    }
}

export async function updateProductoApi(catalogo) {
    const response = await fetch(`https://sistema-tiendasss-1.onrender.com/api/productos/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(catalogo),
    });
    if (!response.ok) {
        throw new Error('Error updating catalog data');
    }
    const data = await response.json();
    return data;
}
export async function deleteProductoApi(id) {
    const response = await fetch(`https://sistema-tiendasss-1.onrender.com/api/productos/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), 
    });
    if (!response.ok) {
        throw new Error('Error deleting catalog data');
    }
    return true;
}
export async function getCategoriaById(id) {
    const response = await fetch(`https://sistema-tiendasss-1.onrender.com/api/categorias/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Error fetching producto data by ID');
    }
    const data = await response.json();
    return data;
}
export async function getCategoriasApi() {
    const response = await fetch('https://sistema-tiendasss-1.onrender.com/api/categorias', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Error fetching categorias data');
    }
    const data = await response.json();
    return data;
}