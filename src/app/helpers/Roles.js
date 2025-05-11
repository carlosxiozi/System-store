export async function getRoles() {
    const response = await fetch(process.env.REACT_APP_API_URL +'/roles',
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
export async function create(data) {
    try {
        const response = await fetch(process.env.REACT_APP_API_URL+'/roles/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error creating  data');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Lanzamos el error para que el código en el hook pueda capturarlo
    }
}

export async function update(data) {
    const response = await fetch( process.env.REACT_APP_API_URL+'/roles/edit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Ensure data is not null or undefined
    });
    if (!response.ok) {
        throw new Error('Error updating catalog data');
    }
    const result = await response.json();
    return result;
}

export async function destroy(id) {
    const response = await fetch(process.env.REACT_APP_API_URL+ `/roles/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Enviamos el id en el cuerpo de la solicitud
    });
    if (!response.ok) {
        throw new Error('Error deleting catalog data');
    }
    return true;
}

export async function syncPermisos(id, permissions) {
    const response = await fetch(process.env.REACT_APP_API_URL+'/roles/updatePermisos',
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
