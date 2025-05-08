// hooks/usePagination.js
import { useState, useMemo, useCallback } from 'react';

export function usePagination(data, modelType, rowsPerPage = 10) {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const getSearchableText = useCallback((item) => {
        switch (modelType) {
            case 'users':
                return [item.name, item.email, item.created_at, item.updated_at].filter(Boolean).join(' ');
            case 'roles':
                return [item.name].filter(Boolean).join(' ');
            case 'people':
                return [item.name, item.first_surname, item.last_surname].filter(Boolean).join(' ');
            case 'session':
                return [item.device, item.token].filter(Boolean).join(' ');
            case 'productos':
                return [item.name, item.descripcion, item.code].filter(Boolean).join(' ');
            case 'deudores':
                return [item.cliente.toLowerCase()].filter(Boolean).join(' ');
            default:
                return '';
        }
    }, [modelType]);

    const filteredData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        if (!search) return data;
        return data.filter(item =>
            search.toLowerCase().split(' ').every(word =>
                getSearchableText(item).toLowerCase().includes(word)
            )
        );
    }, [data, search, getSearchableText]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const handleChangePage = (page) => setCurrentPage(page);
    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    return { currentRows, totalPages, currentPage, handleChangePage, handleSearchChange, search };
}
