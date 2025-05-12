import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';


const ProductosPage: React.FC = () => {
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [importStatus, setImportStatus] = useState<string | null>(null);

    // Función para manejar el cambio de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setExcelFile(e.target.files[0]);
        }
    };

    const handleImportExcel = async () => {
        if (!excelFile) {
            setImportStatus("Por favor, selecciona un archivo Excel.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', excelFile); // Agregar el archivo a la solicitud
    
        // Enviar el archivo al backend
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/productos/import', {
                method: 'POST',
                body: formData, // Enviar el archivo como FormData
            });
            console.log("Archivo Excel:", response);
            if (response.ok) {
                setImportStatus("Productos importados exitosamente.");
            } else {
                setImportStatus("Error al importar los productos.");
            }
        } catch (error) {
            console.error("Error al enviar los datos al backend:", error);
            setImportStatus("Hubo un problema al importar los productos.");
        }
       
    };
    

    // Usar useEffect para mostrar la alerta cuando el estado de importación cambia
    useEffect(() => {
        if (importStatus) {
            Swal.fire({
                icon: importStatus.includes("exitosamente") ? "success" :
                    importStatus.includes("Error") ? "error" : "warning",
                title: importStatus.includes("exitosamente") ? "Éxito" :
                    importStatus.includes("Error") ? "Error" : "Advertencia",
                text: importStatus,
            });
        }
    }, [importStatus]); // Se activa cuando importStatus cambia

    return (
        <div className="flex container mt-4">
          

            <Form.Group>
                <Form.Label>Selecciona un archivo Excel</Form.Label>
                <Form.Control
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                />
            </Form.Group>

            <Button size='sm'
                variant="success"
                onClick={handleImportExcel}
                className="h-100 mt-3"
                style={{ width: '100px', height: '40px' }}
                disabled={!excelFile} 
            >
                Importar  Excel
            </Button>
        </div>
    );
};

export default ProductosPage;
