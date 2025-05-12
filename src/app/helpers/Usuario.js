export async function getUsuarios() {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/usuarios',
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
 
    return data;
}
export async function createUsuarios(catalogo) {

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +'/usuarios/create', {
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

export async function updateUsuario(catalogo) {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/edit`, {
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
export async function deleteUsario(id) {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL +`/usuarios/delete`, {
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