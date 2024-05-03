import React, { FC, useEffect, useState } from 'react';
import { Modal as ModalReactstrap, ModalHeader, ModalBody, ModalFooter, Button, Col, Input, InputGroup, InputGroupText, Label, Row, Table } from 'reactstrap';
import ProductsTable from './products_table';
import { useDebounce } from 'use-debounce';
import { searchProductFilter } from 'common/constants';
import { ProductList } from 'pos/store/products/products_slice';

interface ModalProps {
  isOpen: boolean;
  delete?: boolean;
  onContinue: (p: ProductList) => void;
  onCancel: () => void;
  initialfilterkeyword?: string;
}

const ModalProdsSearch: FC<ModalProps> = ({ isOpen, onContinue, onCancel, initialfilterkeyword = '' }) => {
  const [filter, setFilter] = useState({ ...searchProductFilter, query: initialfilterkeyword });
  const [searchByCode, setSearchByCode] = useState(false);
  const [producto, setProducto] = useState({} as ProductList);

  useEffect(() => {
    setFilter({ ...searchProductFilter, query: initialfilterkeyword });
  }, [initialfilterkeyword]);

  const handleSearch = (value: string) => {
    if (searchByCode) {
      setFilter({ ...filter, codigo: value, query: '' });
    } else {
      setFilter({ ...filter, codigo: '', query: value });
    }
  };

  const handleSearchByCode = (enabled: boolean) => {
    const query = filter.query;
    enabled ? setFilter({ ...filter, codigo: query }) : setFilter({ ...filter, codigo: '' });
    setSearchByCode(enabled);
  };

  return (
    <ModalReactstrap isOpen={isOpen} centered size="xl">
      <ModalHeader>
        <Label for="Search">Busqueda de productos por palabra clave, codigo UPC o SKU:</Label>
        <InputGroup>
          <Input id="Search" placeholder="¿Que está buscando?" name="search" type="search" value={filter.query} onKeyDown={(e) => (e.key === 'Enter' ? handleSearchByCode(true) : null)} onChange={(e) => handleSearch(e.target.value)} />
          <InputGroupText>
            <Input addon checked={searchByCode} onChange={() => handleSearchByCode(!searchByCode)} type="checkbox" />
            Buscar por código o SKU
          </InputGroupText>
        </InputGroup>
      </ModalHeader>
      <ModalBody>
        <div className="pos-table-search-container">
          <ProductsTable showActions={false} productsFilter={filter} showPaginationBottom={true} onEnter={(p) => onContinue(p)} onClick={(w) => setProducto(w)} />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => onContinue(producto)}>
          Seleccionar
        </Button>{' '}
        <Button color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </ModalFooter>
    </ModalReactstrap>
  );
};

export default ModalProdsSearch;
