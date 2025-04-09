export function usePagination(catalogo, currentPage) {
    if (!Array.isArray(catalogo)) {
        throw new Error("catalogo must be an array");
    }
    if (typeof currentPage !== "number" || currentPage < 1) {
        throw new Error("currentPage must be a positive number");
    }

    const rowsPerPage = 8; 
    const currentRows = catalogo.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.ceil(catalogo.length / rowsPerPage); // Número total de páginas

    return {
        currentRows,
        totalPages,
        rowsPerPage,
        currentPage
    };
}