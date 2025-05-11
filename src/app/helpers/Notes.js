export async function getNotes() {
    const response = await fetch(process.env.REACT_APP_API_URL+'/notes',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    if (!response.ok) {
        throw new Error('Error fetching notes data');
    }
    const data = await response.json();
 
    return data;
}
export async function create(catalogo) {
    try {
        const response = await fetch(process.env.REACT_APP_API_URL+'/notes/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(catalogo),
        });

        if (!response.ok) {
            throw new Error('Error creating notes data');
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Lanzamos el error para que el código en el hook pueda capturarlo
    }
}

export async function update(catalogo) {
 
    const response = await fetch(process.env.REACT_APP_API_URL+`/notes/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(catalogo),
    });
    if (!response.ok) {
        throw new Error('Error updating notes data');
    }
    const data = await response.json();
    return data;
}
export async function destroy(id) {
    const response = await fetch(process.env.REACT_APP_API_URL+`/notes/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), 
    });
    if (!response.ok) {
        throw new Error('Error updating total amount');
    }
    return true;
}
export async function montoTotal(data) {
    
    const response = await fetch(process.env.REACT_APP_API_URL+`/notes/updateTotal`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
    });
    console.log(response);
    const temp = await response.json();
    console.log(temp);
    if (!response.ok) {
        throw new Error('Error updating total amount');
    }
    return true;
}
export async function monto_pagado(data) {
    const response = await fetch(process.env.REACT_APP_API_URL+`/notes/updatePayment`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
    });
    if (!response.ok) {
        throw new Error('Error deleting notes data');
    }
    return true;
}