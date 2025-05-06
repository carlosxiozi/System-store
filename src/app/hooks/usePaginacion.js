export function usePagination(data, currentPage, searchValue, modelType) {
    if (!Array.isArray(data)) {
        throw new Error("data must be an array");
    }
    if (typeof currentPage !== "number" || currentPage < 1) {
        throw new Error("currentPage must be a positive number");
    }

    const rowsPerPage = 10; 

    const getSearchableText = (item) => {
        switch (modelType) {
            case 'users':
                return [item.name, item.email, item.created_at, item.updated_at]
                    .filter(Boolean)
                    .join(' ');
            case 'roles':
                return [item.name]
                    .filter(Boolean)
                    .join(' ');
            case 'productos':
                return [item.name, item.code, item.id]
                    .filter(Boolean)
                    .join(' ');
            case 'categorias':
                return [item.device, item.token]
                    .filter(Boolean)
                    .join(' ');
            case 'service':
                return [item.name]
                    .filter(Boolean)
                    .join(' ');
            default:
                return '';
        }
    };

    const filteredData = searchValue
        ? data.filter(item =>
            searchValue
                .toLowerCase()
                .split(' ')
                .every(word =>
                    getSearchableText(item).toLowerCase().includes(word)
                )
        )
        : data;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

    return {
        currentRows,
        rowsPerPage,
        currentPage,
        totalPages,
        filteredData
    };
}
