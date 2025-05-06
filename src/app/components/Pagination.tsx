"use client";

import React, { useState } from "react";
import { Pagination, PaginationItem } from "@mui/material";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({
  totalPages,
  initialPage = 1,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        siblingCount={1}
        boundaryCount={1}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            slots={{ previous: () => <span>{'<'}</span>, next: () => <span>{'>'}</span> }}
            // Puedes personalizar los botones de anterior y siguiente aquí
          />
        )}
      />
    </div>
  );
};

export default CustomPagination;
