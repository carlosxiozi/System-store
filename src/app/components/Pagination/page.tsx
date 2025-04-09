"use client";
import Pagination from 'react-bootstrap/Pagination';
import React, { useState } from 'react';
interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

interface PaginationComponentProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ totalPages, currentPage, onPageChange }) => {
    const [active, setActive] = useState<number>(currentPage);

    const handlePageChange = (pageNumber: number): void => {
        setActive(pageNumber);
        onPageChange(pageNumber);
    };

    const items: JSX.Element[] = [];
    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === active}
                onClick={() => handlePageChange(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    return (
        <div>
            <Pagination>
                <Pagination.Prev
                    onClick={() => handlePageChange(Math.max(active - 1, 1))}
                />
                {items}
                <Pagination.Next
                    onClick={() => handlePageChange(Math.min(active + 1, totalPages))}
                />
            </Pagination>
        </div>
    );
};

export default PaginationComponent;