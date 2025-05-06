export async function getRoles() {
    const response = await fetch('https://sistema-tiendasss-1.onrender.com/api/roles',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    if (!response.ok) {
        throw new Error('Error fetching catalog data');
    }
    const data = await response.json();
    // Log the catalog data
 
    return data.data;
}
export async function create(catalogo) {
    console.log('Entrando al fetch:', catalogo);

    try {
        const response = await fetch('https://sistema-tiendasss-1.onrender.com/api/roles/create', {
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

export async function update(catalogo) {
    const response = await fetch(`https://sistema-tiendasss-1.onrender.com/api/roles/edit`, {
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
export async function destroy(id) {
    const response = await fetch(`https://sistema-tiendasss-1.onrender.com/api/roles/delete`, {
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
export async function getPermissions(id, permissions) {
    const response = await fetch('https://sistema-tiendasss-1.onrender.com/api/roles/updatePermisos',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, permissions }), // Enviamos el id y los permisos en el cuerpo de la solicitud
        });
    if (!response.ok) {
        throw new Error('Error fetching catalog data');
    }
    const data = await response.json();
    // Log the catalog data
 
    return data;
}
