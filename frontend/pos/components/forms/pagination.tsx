import React, { FC } from 'react';
import { DistributeVertical } from 'react-bootstrap-icons';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

interface Props {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const CustomPagination: FC<Props> = ({ currentPage, totalPages, onChange: onChange }) => {
  const handlePaginationClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onChange(page);
    }
  };

  return (
    <div className="d-flex justify-content-center custom-paginator">
      <Pagination size="sm">
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink first href="#" onClick={() => handlePaginationClick(1)} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink previous href="#" onClick={() => handlePaginationClick(currentPage - 1)} />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <PaginationItem key={page} active={page === currentPage}>
            <PaginationLink href="#" onClick={() => handlePaginationClick(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink next href="#" onClick={() => handlePaginationClick(currentPage + 1)} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink last href="#" onClick={() => handlePaginationClick(totalPages)} />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
